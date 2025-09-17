import { fileUrl, prettyStatus } from '../utils'
import { useAuth } from '../store/auth'
export default function ArticleCard({a,actions,showAuthor=false,showMentor=false,showDownload=false}){
  const { user } = useAuth() || {}
  const firstPdf=(a.files||[]).find(f=>(f.mime||'').toLowerCase().includes('pdf'))
  const downloadHref=a.publishedPdfUrl?fileUrl(a.publishedPdfUrl):(firstPdf?fileUrl(firstPdf.url):null)
  const isMine = user && a?.createdBy && String(a.createdBy)===String(user._id)
  const amMentor = user && user.role==='mentor' && a?.mentorEmail && a.mentorEmail.toLowerCase()===user.email?.toLowerCase()
  const authorLabel = isMine ? `${user.firstName} ${user.lastName}` : (a.authorName||'-')
  const mentorLabel = amMentor ? `${user.firstName} ${user.lastName}` : (a.mentorName || a.mentorEmail || '-')
  return (<div className="card">
    <div className="row" style={{justifyContent:'space-between'}}><h3 style={{margin:'0 0 6px 0'}}>{a.title}</h3>{actions}</div>
    <div className="muted">{a.scientificField}</div>
    <div className="muted">{(a.keywords||[]).join(', ')}</div>
    <p style={{whiteSpace:'pre-wrap'}}>{a.abstract}</p>
    <div className="row">
      <span className={`status ${a.status}`}>Status: {prettyStatus(a.status)}</span>
      {showAuthor && <span className="muted">Author: {authorLabel}</span>}
      {showMentor && <span className="muted">Mentor: {mentorLabel}</span>}
      {showDownload && downloadHref && <a className="btn" href={downloadHref} target="_blank">Download PDF</a>}
    </div>
  </div>)
}
