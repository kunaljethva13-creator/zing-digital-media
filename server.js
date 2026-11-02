const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// In-Memory Storage for Inquiries
let leadsDatabase = [];

// Root health check route
app.get('/', (req, res) => {
  res.send('<h1>Zing Digital Media Agency Backend is Live! 🚀</h1>');
});

// 1. Submit Inquiry Route (called when visitor fills the form)
app.post('/api/leads', (req, res) => {
  const { name, phone, email, service, message } = req.body;

  const newLead = {
    id: Date.now(),
    name: name || 'Anonymous',
    phone: phone || 'Not Provided',
    email: email || 'Not Provided',
    service: service || 'Performance Marketing',
    message: message || '',
    status: 'Pending', // Default status: Pending
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };

  leadsDatabase.unshift(newLead);
  console.log(`📥 New lead received: ${newLead.name} (${newLead.phone})`);
  return res.status(201).json({ success: true, lead: newLead });
});

// 2. Fetch All Leads Route (called by your Admin Dashboard)
app.get('/api/admin/leads', (req, res) => {
  return res.status(200).json({ success: true, leads: leadsDatabase });
});

// 3. Update Call Status Route (Toggle between Pending and Reached)
app.patch('/api/admin/leads/:id', (req, res) => {
  const leadId = Number(req.params.id);
  const lead = leadsDatabase.find((l) => l.id === leadId);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  lead.status = lead.status === 'Reached' ? 'Pending' : 'Reached';
  return res.status(200).json({ success: true, lead });
});

// 4. Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'agency123') {
    return res.status(200).json({ success: true, token: 'agency-secret-auth-token' });
  }
  return res.status(401).json({ success: false, error: 'Invalid username or password' });
});

// Start Server on Port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});