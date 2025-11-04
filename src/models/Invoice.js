import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  senderEmail: { type: String },
  subject: { type: String },
  receivedDate: { type: Date },
  status: { type: String, enum: ['pending','processed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', invoiceSchema);
