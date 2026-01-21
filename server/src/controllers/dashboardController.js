const ScanRecord = require('../models/ScanRecord');

// Helper function to calculate health score
const calculateHealthScore = (scans) => {
  let score = 100;
  
  scans.forEach(scan => {
    switch (scan.severity) {
      case 'Mild':
        score -= 5;
        break;
      case 'Moderate':
        score -= 10;
        break;
      case 'Severe':
        score -= 20;
        break;
      // Healthy scans don't reduce score
    }
  });
  
  return Math.max(0, Math.min(100, score));
};

// Helper function to get day name
const getDayName = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

// Helper function to count active issues
const countActiveIssues = (scans) => {
  const uniqueDiseases = new Set();
  
  scans.forEach(scan => {
    if (scan.severity !== 'Healthy' && scan.confidence > 30) {
      uniqueDiseases.add(scan.disease_name);
    }
  });
  
  return uniqueDiseases.size;
};

// Dashboard summary endpoint
const getDashboardSummary = async (req, res) => {
  try {
    let userId = req.user?.id;

    // For development: use test user if not authenticated
    if (!userId) {
      const User = require('../models/User');
      let testUser = await User.findOne({ email: 'test@example.com' });
      if (testUser) {
        userId = testUser._id;
      } else {
        return res.status(404).json({ 
          success: false, 
          message: 'No user found. Please create a test user first.' 
        });
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Get scans for last 7 days
    const currentWeekScans = await ScanRecord.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: -1 });

    // Get scans for previous 7 days (for comparison)
    const previousWeekScans = await ScanRecord.find({
      userId,
      timestamp: { 
        $gte: fourteenDaysAgo,
        $lt: sevenDaysAgo
      }
    }).sort({ timestamp: -1 });

    // Calculate current health score
    const currentHealth = calculateHealthScore(currentWeekScans);
    const previousHealth = calculateHealthScore(previousWeekScans);
    
    // Calculate weekly change
    let weeklyChange = '0%';
    if (previousHealth > 0) {
      const change = ((currentHealth - previousHealth) / previousHealth) * 100;
      weeklyChange = change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
    } else if (currentHealth > 0) {
      weeklyChange = '+100%';
    }

    // Count active issues
    const activeIssues = countActiveIssues(currentWeekScans);

    res.json({
      overall_health: currentHealth,
      weekly_change: weeklyChange,
      active_issues: activeIssues
    });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard summary' 
    });
  }
};

// Health trend endpoint
const getHealthTrend = async (req, res) => {
  try {
    let userId = req.user?.id;

    // For development: use test user if not authenticated
    if (!userId) {
      const User = require('../models/User');
      let testUser = await User.findOne({ email: 'test@example.com' });
      if (testUser) {
        userId = testUser._id;
      } else {
        return res.status(404).json({ 
          success: false, 
          message: 'No user found. Please create a test user first.' 
        });
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get all scans for last 7 days
    const scans = await ScanRecord.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: 1 });

    // Group scans by day
    const dailyScans = {};
    const today = new Date();
    
    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = date.toDateString();
      dailyScans[dayKey] = [];
    }

    // Group scans by day
    scans.forEach(scan => {
      const dayKey = scan.timestamp.toDateString();
      if (dailyScans[dayKey]) {
        dailyScans[dayKey].push(scan);
      }
    });

    // Calculate health score for each day
    const trendData = Object.keys(dailyScans).map(dayKey => {
      const date = new Date(dayKey);
      const dayScans = dailyScans[dayKey];
      const health = calculateHealthScore(dayScans);
      
      return {
        day: getDayName(date),
        health: health
      };
    });

    res.json(trendData);

  } catch (error) {
    console.error('Health trend error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch health trend' 
    });
  }
};

// Disease breakdown endpoint
const getDiseaseBreakdown = async (req, res) => {
  try {
    let userId = req.user?.id;

    // For development: use test user if not authenticated
    if (!userId) {
      const User = require('../models/User');
      let testUser = await User.findOne({ email: 'test@example.com' });
      if (testUser) {
        userId = testUser._id;
      } else {
        return res.status(404).json({ 
          success: false, 
          message: 'No user found. Please create a test user first.' 
        });
      }
    }

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get scans for current month, excluding healthy scans
    const monthlyScans = await ScanRecord.find({
      userId,
      timestamp: { $gte: currentMonth },
      severity: { $ne: 'Healthy' }
    });

    // Count diseases
    const diseaseCount = {};
    monthlyScans.forEach(scan => {
      if (scan.confidence > 30) { // Only count confident predictions
        diseaseCount[scan.disease_name] = (diseaseCount[scan.disease_name] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const breakdown = Object.entries(diseaseCount)
      .map(([disease, count]) => ({ disease, count }))
      .sort((a, b) => b.count - a.count);

    res.json(breakdown);

  } catch (error) {
    console.error('Disease breakdown error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch disease breakdown' 
    });
  }
};

// Recent diagnoses endpoint
const getRecentDiagnoses = async (req, res) => {
  try {
    let userId = req.user?.id;

    // For development: use test user if not authenticated
    if (!userId) {
      const User = require('../models/User');
      let testUser = await User.findOne({ email: 'test@example.com' });
      if (testUser) {
        userId = testUser._id;
      } else {
        return res.status(404).json({ 
          success: false, 
          message: 'No user found. Please create a test user first.' 
        });
      }
    }

    // Get last 10 scans
    const recentScans = await ScanRecord.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Format the response
    const diagnoses = recentScans.map(scan => {
      const now = new Date();
      const scanDate = new Date(scan.timestamp);
      const diffTime = Math.abs(now - scanDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let dateLabel;
      if (diffDays === 0) {
        dateLabel = 'Today';
      } else if (diffDays === 1) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = scanDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      return {
        crop_name: scan.crop_name,
        disease_name: scan.disease_name,
        severity: scan.severity,
        confidence: Math.round(scan.confidence),
        date: dateLabel
      };
    });

    res.json(diagnoses);

  } catch (error) {
    console.error('Recent diagnoses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch recent diagnoses' 
    });
  }
};

module.exports = {
  getDashboardSummary,
  getHealthTrend,
  getDiseaseBreakdown,
  getRecentDiagnoses
};