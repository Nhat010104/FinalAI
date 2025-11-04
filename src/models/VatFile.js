import mongoose from 'mongoose';

const vatFileSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  fileName: { type: String },
  localPath: { type: String },
  driveFileId: { type: String },
  source: { type: String },
  uploadedDate: { type: Date, default: Date.now },
  extractedData: { type: Object, default: {} },
  isPublished: { type: Boolean, default: false }
});

export default mongoose.model('VatFile', vatFileSchema);
