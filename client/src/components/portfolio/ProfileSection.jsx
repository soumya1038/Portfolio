import { FiMapPin, FiDownload, FiMail, FiArrowUpRight } from 'react-icons/fi';

function ProfileSection({ portfolio, stats = [] }) {
  if (!portfolio) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(portfolio.name || 'User')}&size=200&background=0ea5e9&color=fff`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
      {/* Profile Info */}
      <div className="text-center lg:text-left motion-safe:animate-rise">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-[0.2em]">
          Available for collaboration
        </div>
        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mt-4 text-white">
          Hi, I&apos;m {portfolio.name}
        </h1>
        <p className="text-lg md:text-xl text-primary-100 mt-3">{portfolio.title || 'Creative Technologist'}</p>

        {portfolio.location && (
          <p className="flex items-center justify-center lg:justify-start gap-2 text-primary-200 mt-4">
            <FiMapPin className="h-5 w-5" />
            {portfolio.location}
          </p>
        )}

        {portfolio.bio && (
          <p className="mt-4 text-primary-50/90 max-w-2xl leading-relaxed">
            {portfolio.bio}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <a href="#projects" className="btn-primary">
            View Work
          </a>
          {portfolio.email && (
            <a href={`mailto:${portfolio.email}`} className="btn-secondary flex items-center gap-2">
              <FiMail className="h-4 w-4" />
              Contact
            </a>
          )}
          {portfolio.resumeUrl && (
            <a
              href={portfolio.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <FiDownload className="h-4 w-4" />
              Resume
            </a>
          )}
        </div>

        {stats.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-left">
                <p className="text-2xl font-bold text-ink">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Image */}
      <div className="relative flex justify-center lg:justify-end motion-safe:animate-float">
        <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-primary-400/40 to-accent-400/40 blur-2xl"></div>
        <div className="relative bg-white/10 p-2 rounded-[32px] border border-white/20 shadow-glow">
          <img
            src={portfolio.profileImage || defaultAvatar}
            alt={portfolio.name}
            className="w-64 h-64 md:w-80 md:h-80 rounded-[28px] object-cover"
          />
          <div className="absolute -bottom-4 -right-4 bg-white text-ink px-4 py-2 rounded-2xl shadow-soft flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
            Open to work
            <FiArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
