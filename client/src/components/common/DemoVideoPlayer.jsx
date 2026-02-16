import { useEffect, useRef, useState } from 'react';
import { FiPlay, FiMaximize2, FiExternalLink } from 'react-icons/fi';
import { parseVideoLink } from '../../utils/videoLinks';

function DemoVideoPlayer({ videoUrl, title = 'Demo video', heightClass = 'h-56 md:h-64', showHelper = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [activeEmbedIndex, setActiveEmbedIndex] = useState(0);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setThumbError(false);
    setActiveEmbedIndex(0);
    setEmbedFailed(false);
    setVideoFailed(false);
  }, [videoUrl]);

  if (!videoUrl) return null;

  const videoMeta = parseVideoLink(videoUrl);
  const embedUrls = videoMeta.embedUrls?.length
    ? videoMeta.embedUrls
    : videoMeta.embedUrl
      ? [videoMeta.embedUrl]
      : [];
  const previewUrl = embedUrls[activeEmbedIndex] || '';
  const canTryAlternative = activeEmbedIndex < embedUrls.length - 1;
  const thumbnailUrl = videoMeta.thumbnailUrl;
  const openUrl = videoMeta.openUrl || videoMeta.url || videoUrl;

  if (videoMeta.type === 'unknown') {
    return (
      <div className="demo-video-fallback rounded-2xl border border-dashed border-line p-4 text-sm shadow-soft">
        <p className="demo-video-fallback__title font-semibold mb-2">Demo Video</p>
        <p className="demo-video-fallback__desc">Inline preview supports Google Drive, YouTube, Vimeo, and direct video files.</p>
        {openUrl && (
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 mt-3"
          >
            <FiExternalLink className="h-4 w-4" />
            Open Demo Video
          </a>
        )}
      </div>
    );
  }
  const handlePlay = () => {
    setIsPlaying(true);
    setEmbedFailed(false);
    setVideoFailed(false);
  };

  const handleFullscreen = () => {
    if (!playerRef.current?.requestFullscreen) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      playerRef.current.requestFullscreen();
    }
  };

  const handleTryAlternative = () => {
    if (!canTryAlternative) return;
    setActiveEmbedIndex((current) => current + 1);
    setEmbedFailed(false);
  };

  const wrapperClass = showHelper ? 'space-y-3' : 'h-full';
  const frameClass = `demo-video-frame relative overflow-hidden rounded-2xl border shadow-soft ${showHelper ? '' : 'h-full'}`;
  const isDirectVideo = videoMeta.type === 'direct';

  return (
    <div className={wrapperClass}>
      <div
        ref={playerRef}
        className={frameClass}
      >
        {isPlaying ? (
          isDirectVideo ? (
            <div className={`relative ${showHelper ? '' : 'h-full'}`}>
              {videoFailed ? (
                <div className={`demo-video-fallback w-full ${showHelper ? heightClass : 'h-full'} flex flex-col items-center justify-center gap-3 p-4 text-center`}>
                  <p className="demo-video-fallback__title font-semibold">Unable to play video here</p>
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <FiExternalLink className="h-4 w-4" />
                    Open Video
                  </a>
                </div>
              ) : (
                <>
                  <video
                    src={videoMeta.url}
                    className={`w-full ${showHelper ? heightClass : 'h-full'} object-cover`}
                    controls
                    autoPlay
                    playsInline
                    onError={() => setVideoFailed(true)}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <a
                      href={openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo-video-action px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-soft"
                    >
                      <FiExternalLink className="h-3.5 w-3.5" />
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="demo-video-action px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-soft"
                    >
                      <FiMaximize2 className="h-4 w-4" />
                      Full screen
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full pb-[56.25%]">
              {embedFailed || !previewUrl ? (
                <div className="absolute inset-0 demo-video-fallback flex flex-col items-center justify-center gap-3 p-4 text-center">
                  <p className="demo-video-fallback__title font-semibold">Unable to load inline player</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {canTryAlternative && (
                      <button
                        type="button"
                        onClick={handleTryAlternative}
                        className="demo-video-action px-3 py-1.5 rounded-full text-xs font-semibold shadow-soft"
                      >
                        Try alternate player
                      </button>
                    )}
                    <a
                      href={openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex items-center gap-2"
                    >
                      <FiExternalLink className="h-4 w-4" />
                      Open Video
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  title={title}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  onError={() => setEmbedFailed(true)}
                />
              )}
              {!embedFailed && previewUrl && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {canTryAlternative && (
                    <button
                      type="button"
                      onClick={handleTryAlternative}
                      className="demo-video-action px-3 py-1.5 rounded-full text-xs font-semibold shadow-soft"
                    >
                      Alternate Source
                    </button>
                  )}
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="demo-video-action px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-soft"
                  >
                    <FiExternalLink className="h-3.5 w-3.5" />
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="demo-video-action px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-soft"
                  >
                    <FiMaximize2 className="h-4 w-4" />
                    Full screen
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className={`group block w-full ${showHelper ? '' : 'h-full'} text-left`}
            aria-label={`Play ${title}`}
          >
            <div className={`relative ${showHelper ? '' : 'h-full'}`}>
              {thumbError || !thumbnailUrl ? (
                <div className={`demo-video-thumb-fallback w-full ${showHelper ? heightClass : 'h-full'} flex items-center justify-center`}>
                  <span className="demo-video-thumb-fallback__text font-semibold">Demo preview unavailable</span>
                </div>
              ) : (
                <img
                  src={thumbnailUrl}
                  alt={`${title} preview`}
                  className={`w-full ${showHelper ? heightClass : 'h-full'} object-cover group-hover:scale-105 transition-transform duration-500`}
                  loading="lazy"
                  onError={() => setThumbError(true)}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="demo-video-cta inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow-soft ring-1 backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.02]">
                  <FiPlay className="h-4 w-4" />
                  Play Demo
                </span>
              </div>
            </div>
          </button>
        )}
      </div>

      {showHelper && (
        <p className="demo-video-helper text-xs">
          If inline play fails, use Open Video. For Drive links, keep file access set to Anyone with the link.
        </p>
      )}
    </div>
  );
}

export default DemoVideoPlayer;
