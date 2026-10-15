import express from 'express';

const router = express.Router();

// Intelligent rule-based NLP categorization engine
const categorizeIssueText = (text) => {
  const lower = (text || '').toLowerCase();

  if (/pothole|road|crater|asphalt|pavement|tarmac|bump|divider/i.test(lower)) {
    return {
      category: 'Pothole',
      priority: /deep|major|accident|danger|crater|severe|huge/i.test(lower) ? 'high' : 'medium',
      suggestion: 'Road repair and cold-mix asphalt patch required. Inspect sub-base for water seepage.',
      department: 'VMC Engineering & Roads Department',
      estimatedHours: 24
    };
  }

  if (/garbage|waste|trash|dump|litter|bin|smell|stench|filth|plastic/i.test(lower)) {
    return {
      category: 'Garbage',
      priority: /overflow|spill|severe|animal|hospital|medical/i.test(lower) ? 'high' : 'medium',
      suggestion: 'Dispatch solid waste collection vehicle and deploy disinfectant spray.',
      department: 'VMC Solid Waste Management Health Wing',
      estimatedHours: 12
    };
  }

  if (/streetlight|light|dark|pole|bulb|lamp|wiring|transformer/i.test(lower)) {
    return {
      category: 'Streetlight',
      priority: /dark|bridge|junction|highway|hazard|accident/i.test(lower) ? 'high' : 'medium',
      suggestion: 'Electrician team dispatch required to check phase line and replace high-efficiency LED fixture.',
      department: 'VMC Street Lighting & Electrical Division',
      estimatedHours: 18
    };
  }

  if (/water|leak|pipe|burst|potable|drinking|supply|pressure/i.test(lower)) {
    return {
      category: 'Water',
      priority: 'high',
      suggestion: 'Emergency main valve shutdown advised. Hydraulic team dispatch for pipeline clamp/weld.',
      department: 'VMC Water Works Department',
      estimatedHours: 8
    };
  }

  if (/drain|drainage|manhole|sewer|gutter|sewage|stagnant/i.test(lower)) {
    return {
      category: 'Drainage Overflow',
      priority: /open|school|fall|deep|child|overflow/i.test(lower) ? 'high' : 'medium',
      suggestion: 'Super-sucker suction vehicle required. Urgent manhole cover inspection and barricading.',
      department: 'VMC Drainage & Storm Water Cell',
      estimatedHours: 12
    };
  }

  if (/traffic|signal|jam|congestion|parking|encroachment/i.test(lower)) {
    return {
      category: 'Traffic',
      priority: 'medium',
      suggestion: 'Notify Vadodara City Traffic Police control room and recalibrate timer cycle.',
      department: 'Vadodara City Traffic Department',
      estimatedHours: 6
    };
  }

  return {
    category: 'Other',
    priority: 'medium',
    suggestion: 'Municipal inspector assigned for physical on-site evaluation.',
    department: 'NagrikSetu General Civic Grievance Cell',
    estimatedHours: 48
  };
};

// @route   POST /api/ai/categorize
// @desc    Analyze issue description and suggest category & priority
router.post('/categorize', (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description text is required for AI categorization' });
    }

    const result = categorizeIssueText(description);
    res.json(result);
  } catch (error) {
    console.error('AI categorization error:', error);
    res.status(500).json({ message: 'Server error in AI categorization' });
  }
});

// @route   POST /api/ai/chat
// @desc    Context-aware civic assistance chatbot
router.post('/chat', (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const lower = message.toLowerCase();
    let reply = '';

    if (/hello|hi|hey|namaste/i.test(lower)) {
      reply = "Namaste! I am NagrikSetu's AI Civic Assistant. How can I assist you today? You can ask me how to report an issue, check complaint status, look up municipal helplines, or learn about civic response times.";
    } else if (/how (do|can) i report|submit (a )?report|report an issue|pothole/i.test(lower)) {
      reply = "To report a civic hazard on NagrikSetu:\n1. Click 'Report Issue' in the top navigation.\n2. Add a clear title and description.\n3. NagrikSetu AI will auto-categorize and suggest priority.\n4. Pin the exact location on the interactive map or enable GPS auto-detect.\n5. Attach photo evidence and click Submit!";
    } else if (/status|track|progress/i.test(lower)) {
      reply = "You can track the live lifecycle of all your submissions on your 'Dashboard'. Statuses transition from 'Submitted' -> 'In Progress' -> 'Resolved'. You'll also see admin verification updates and civic points earned.";
    } else if (/streetlight|dark|lamp/i.test(lower)) {
      reply = "Streetlight outages in Vadodara are managed by the VMC Street Lighting Division. Critical bridge and junction outages are prioritized within 18 hours. Please submit a report with the pole number or landmark for rapid dispatch!";
    } else if (/garbage|waste|dump|trash/i.test(lower)) {
      reply = "For uncollected municipal garbage or overflowing dumpsters, VMC Solid Waste Management operates morning and evening collection cycles. Reports submitted on NagrikSetu are routed directly to ward sanitary inspectors.";
    } else if (/helpline|phone|contact|emergency|police|hospital/i.test(lower)) {
      reply = "Key Civic Helplines:\n• Vadodara Municipal Corporation (VMC): 1800 233 0266 / 0265-2433111\n• Police Control Room: 100 / 112\n• Fire & Emergency: 101\n• Ambulance Service: 108\n• Women Helpline: 181";
    } else if (/points|rewards|leaderboard|badge/i.test(lower)) {
      reply = "Every verified civic hazard report earns you 50 Civic Points. Upvoting and community validations earn you additional citizen impact badges shown on your Profile!";
    } else {
      reply = "Thank you for reaching out to NagrikSetu! Your query regarding civic infrastructure has been noted. You can file a detailed geo-tagged report on the 'Report Issue' tab, or view neighborhood updates on the 'Civic Map'. For urgent municipal emergencies in Vadodara, dial VMC Toll-Free at 1800 233 0266.";
    }

    res.json({ reply });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Server error in AI chat' });
  }
});

export default router;
