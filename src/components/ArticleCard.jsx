import { fileUrl } from '../utils'
import { useAuth } from '../store/auth'

export default function ArticleCard({a,actions}){
  const { user } = useAuth() || {}

  const firstPdf=(a.files||[]).find(f=>(f.mime||'').toLowerCase().includes('pdf'))
  const pdfUrl = firstPdf ? fileUrl(firstPdf.url) : (a.publishedPdfUrl ? fileUrl(a.publishedPdfUrl) : null)
  const pdfName = firstPdf?.name || (a.publishedPdfUrl ? 'article.pdf' : null)

  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:'0 0 6px 0'}}>{a.title}</h3>
        {actions}
      </div>

      {/* Authors */}
      {(a.authorsText) && (
        <div className="muted">"Authors:" {a.authorsText}</div>
      )}

      {/* PDF link with file name */}
      {pdfUrl && (
        <div className="row" style={{gap: '8px', alignItems:'center'}}>
          <span className="muted">PDF:</span>
          <a className="btn" href={pdfUrl} target="_blank" rel="noopener noreferrer" download={pdfName || true}>
            {pdfName || 'Download PDF'}
          </a>
        </div>
      )}
    </div>
  )
}
