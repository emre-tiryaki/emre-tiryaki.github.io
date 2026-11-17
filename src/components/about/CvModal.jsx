import { useTranslation } from '../../hooks/translation';
import PdfModal from '../ui/PdfModal';
import trCv from '../../assets/cv/tr_cv.pdf';
import enCv from '../../assets/cv/en_cv.pdf';

export default function CvModal({ isOpen, onClose }) {
  const { lang, t } = useTranslation();
  if (!isOpen) return null;

  const fileName = lang === 'tr' ? 'Emre_Tiryaki_CV_TR.pdf' : 'Emre_Tiryaki_CV_EN.pdf';

  return (
    <PdfModal
      onClose={onClose}
      pdfUrl={lang === 'tr' ? trCv : enCv}
      title={fileName}
      downloadName={fileName}
      viewerTitle={t('about.cvViewerTitle')}
    />
  );
}
