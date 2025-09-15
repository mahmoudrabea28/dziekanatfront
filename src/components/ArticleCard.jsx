import { fileUrl, prettyStatus } from '../utils'
export default function ArticleCard({a,actions,showAuthor=false,showMentor=false,showDownload=false}){
  const firstPdf=(a.files||[]).find(f=>(f.mime||'').toLowerCase().includes('pdf'))
  const downloadHref=a.publishedPdfUrl?fileUrl(a.publishedPdfUrl):(firstPdf?fileUrl(firstPdf.url):null)
  return (<div className="card">
    <div className="row" style={{justifyContent:'space-between'}}><h3 style={{margin:'0 0 6px 0'}}>{a.title}</h3>{actions}</div>
    <div className="muted">{a.scientificField}</div>
    <div className="muted">{(a.keywords||[]).join(', ')}</div>
    <p style={{whiteSpace:'pre-wrap'}}>{a.abstract}</p>
    <div className="row">
      <span className={`status ${a.status}`}>Status: {prettyStatus(a.status)}</span>
      {showAuthor && <span className="muted">Author: {a.authorName||'-'}</span>}
      {showMentor && <span className="muted">Mentor: {a.mentorName || a.mentorEmail || '-'}</span>}
      {showDownload && downloadHref && <a className="btn" href={downloadHref} target="_blank">Download PDF</a>}
    </div>
  </div>)
}
