// src/pages/Submit.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Submit() {
  const nav = useNavigate();

  // ---- draft persistence ----
  const LS_KEY = 'submitDraft_v1';
  function loadDraft() {
    try {
      const s = localStorage.getItem(LS_KEY);
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  }

  // lazy init from localStorage so القيم تظهر من أول ريندر
  const [title, setTitle] = useState(() => loadDraft().title || '');
  const [scientificField, setField] = useState(
    () => loadDraft().scientificField || ''
  );
  const [keywords, setKeywords] = useState(() => loadDraft().keywords || '');
  const [abstract, setAbstract] = useState(() => loadDraft().abstract || '');
  const [mentorEmail, setMentor] = useState(
    () => loadDraft().mentorEmail || ''
  );
  const [files, setFiles] = useState([]);

  // errors
  const [err, setErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pdfErr, setPdfErr] = useState('');

  // save draft on change
  useEffect(() => {
    const v = { title, scientificField, keywords, abstract, mentorEmail };
    localStorage.setItem(LS_KEY, JSON.stringify(v));
  }, [title, scientificField, keywords, abstract, mentorEmail]);

  // pick PDFs with pre-validation (type/size)
  function onPickFiles(e) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) {
      setFiles([]);
      return;
    }
    for (const f of picked) {
      if (f.type !== 'application/pdf') {
        setPdfErr('Only PDF files are allowed');
        e.target.value = '';
        setFiles([]);
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setPdfErr(`PDF "${f.name}" must be ≤ 10MB`);
        e.target.value = '';
        setFiles([]);
        return;
      }
    }
    setPdfErr('');
    setFiles(picked);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setEmailErr('');
    setPdfErr('');

    // custom validation (بدل رسالة المتصفح)
    if (!title.trim()) {
      setErr('Title is required');
      return;
    }
    if (!scientificField.trim()) {
      setErr('Scientific field is required');
      return;
    }
    if (!mentorEmail.trim()) {
      setEmailErr('Mentor email is required');
      return;
    }
    if (abstract.length > 500) {
      setErr('Abstract must be ≤ 500 characters');
      return;
    }
    if (!files.length) {
      setPdfErr('PDF is required');
      return;
    }
    for (const f of files) {
      if (f.type !== 'application/pdf') {
        setPdfErr('Only PDF files are allowed');
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setPdfErr(`PDF "${f.name}" must be ≤ 10MB`);
        return;
      }
    }

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('scientificField', scientificField);
      fd.append('keywords', keywords);
      fd.append('abstract', abstract);
      fd.append('mentorEmail', mentorEmail);
      files.forEach((f) => fd.append('files', f));

      await api.post('/articles', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.removeItem(LS_KEY);
      nav('/my-works');
    } catch (ex) {
      setErr(ex?.response?.data?.error || 'Failed to submit');
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 900, margin: '20px auto' }}>
        <h2>Add new article</h2>

        {/* noValidate: نعرض رسائلنا بدل رسالة المتصفح */}
        <form className="grid" onSubmit={onSubmit} noValidate>
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="input"
            placeholder="Scientific field"
            value={scientificField}
            onChange={(e) => setField(e.target.value)}
          />

          <input
            className="input"
            placeholder="keyword1, keyword2"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />

          <textarea
            className="textarea"
            style={{ resize: 'none' }}  // منع التكبير
            placeholder="Short description (abstract)"
            value={abstract}
            maxLength={500}
            onChange={(e) => setAbstract(e.target.value)}
          />
          <div className="muted">{abstract.length}/500</div>

          <input
            className="input"
            placeholder="Mentor email (required)"
            value={mentorEmail}
            onChange={(e) => setMentor(e.target.value)}
          />
          {emailErr && (
            <div className="muted" style={{ color: '#dc2626' }}>
              {emailErr}
            </div>
          )}

          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={onPickFiles}
          />
          {pdfErr && (
            <div className="muted" style={{ color: '#dc2626' }}>
              {pdfErr}
            </div>
          )}

          {err && (
            <div className="muted" style={{ color: '#dc2626' }}>
              {err}
            </div>
          )}

          <button className="btn primary">Add new article</button>
        </form>
      </div>
    </div>
  );
}
