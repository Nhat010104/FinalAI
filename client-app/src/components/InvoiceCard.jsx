import { FileText, Calendar, Mail, Download, Eye } from 'lucide-react'

function InvoiceCard({ invoice, apiBaseUrl = 'http://localhost:4000' }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileUrl = () => {
    if (invoice.localPath) {
      // Extract filename from localPath (e.g., "uploads/vat_files/123-filename.pdf")
      const filename = invoice.localPath.split('/').pop()
      return `${apiBaseUrl}/uploads/vat_files/${filename}`
    }
    return null
  }

  const fileUrl = getFileUrl()

  return (
    <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border bg-white border-gray-200 hover:border-blue-300">
      {/* Card Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <FileText className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate text-gray-900">
              {invoice.fileName || 'Không có tên file'}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-gray-500">
              <Calendar size={14} />
              <span className="text-xs font-medium">
                {formatDate(invoice.uploadedDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6">
        {/* Source (Nguồn VAT) */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 text-gray-700">
            <Mail size={18} />
            <span className="text-sm font-semibold">Nguồn VAT:</span>
          </div>
          <p className="text-sm pl-6 text-gray-600">
            {invoice.source || 'Không xác định'}
          </p>
        </div>

        {/* Invoice Info */}
        {invoice.invoiceId && (
          <div className="mb-4">
            {invoice.invoiceId.subject && (
              <div className="mb-2 text-gray-700">
                <span className="text-sm font-semibold">Tiêu đề: </span>
                <span className="text-sm">{invoice.invoiceId.subject}</span>
              </div>
            )}
            {invoice.invoiceId.senderEmail && (
              <div className="mb-2 text-gray-700">
                <span className="text-sm font-semibold">Email gửi: </span>
                <span className="text-sm">{invoice.invoiceId.senderEmail}</span>
              </div>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            invoice.isPublished
              ? 'bg-green-500 text-white'
              : 'bg-yellow-200 text-yellow-800'
          }`}>
            {invoice.isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-4 sm:px-6 py-3 flex gap-2 border-t bg-white border-gray-200">
        {fileUrl && (
          <>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            >
              <Eye size={18} />
              Xem file
            </a>
            <a
              href={fileUrl}
              download
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              <Download size={18} />
              Tải xuống
            </a>
          </>
        )}
        {!fileUrl && (
          <div className="flex-1 text-center py-2.5 px-3 rounded-lg text-sm text-gray-500">
            File không khả dụng
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceCard

