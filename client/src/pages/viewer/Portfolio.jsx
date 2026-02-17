import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiMail, FiMapPin } from 'react-icons/fi';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Loading from '../../components/common/Loading';
import ProfileSection from '../../components/portfolio/ProfileSection';
import SkillsSection from '../../components/portfolio/SkillsSection';
import AchievementsSection from '../../components/portfolio/AchievementsSection';
import ProjectCard from '../../components/portfolio/ProjectCard';
import { portfolioService } from '../../services/portfolio.service';
import { projectService } from '../../services/project.service';
import { achievementService } from '../../services/achievement.service';

const DEFAULT_ENGAGEMENT = {
  uniqueVisitors: 0,
  averageRating: 0,
  totalRatings: 0,
};

const STAR_LAYOUT = [
  { scatterX: '-122px', scatterY: '-74px', rowX: '-124px', wobbleDelay: '0ms' },
  { scatterX: '-62px', scatterY: '70px', rowX: '-62px', wobbleDelay: '120ms' },
  { scatterX: '0px', scatterY: '-90px', rowX: '0px', wobbleDelay: '240ms' },
  { scatterX: '68px', scatterY: '76px', rowX: '62px', wobbleDelay: '360ms' },
  { scatterX: '128px', scatterY: '-66px', rowX: '124px', wobbleDelay: '480ms' },
];

function normalizeExternalUrl(value) {
  if (!value || typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return '';
    }
  }
}

function WebsiteLinkIcon({ website, className = 'h-6 w-6' }) {
  const [faviconIndex, setFaviconIndex] = useState(0);
  const websiteUrl = normalizeExternalUrl(website);
  const faviconCandidates = [];

  if (websiteUrl) {
    const parsedWebsiteUrl = new URL(websiteUrl);
    const websiteOrigin = parsedWebsiteUrl.origin;
    const websiteHost = parsedWebsiteUrl.hostname;

    faviconCandidates.push(`https://icon.horse/icon/${encodeURIComponent(websiteHost)}`);
    faviconCandidates.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(websiteHost)}&sz=64`);
    faviconCandidates.push(`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(websiteOrigin)}&sz=64`);
    faviconCandidates.push(`${websiteOrigin}/favicon.ico`);
    faviconCandidates.push(`${websiteOrigin}/favicon.svg`);
    faviconCandidates.push(`${websiteOrigin}/favicon.png`);
    faviconCandidates.push(`${websiteOrigin}/apple-touch-icon.png`);
    faviconCandidates.push(`https://icons.duckduckgo.com/ip3/${encodeURIComponent(websiteHost)}.ico`);
  }

  useEffect(() => {
    setFaviconIndex(0);
  }, [websiteUrl]);

  if (!faviconCandidates.length || faviconIndex >= faviconCandidates.length) {
    return <FiGlobe className={className} aria-hidden="true" />;
  }

  return (
    <img
      src={faviconCandidates[faviconIndex]}
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      referrerPolicy="no-referrer"
      onError={() => setFaviconIndex((prev) => prev + 1)}
    />
  );
}

function VisitorIcon({ size = 24, color = '#000000' }) {
  const clipId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <g clipPath={`url(#${clipId})`}>
        <path
          opacity="0.4"
          d="M17.53 7.77C17.46 7.76 17.39 7.76 17.32 7.77C15.77 7.72 14.54 6.45 14.54 4.89C14.54 3.3 15.83 2 17.43 2C19.02 2 20.32 3.29 20.32 4.89C20.31 6.45 19.08 7.72 17.53 7.77Z"
          fill={color}
        />
        <path
          opacity="0.4"
          d="M20.79 14.7004C19.67 15.4504 18.1 15.7304 16.65 15.5404C17.03 14.7204 17.23 13.8104 17.24 12.8504C17.24 11.8504 17.02 10.9004 16.6 10.0704C18.08 9.8704 19.65 10.1504 20.78 10.9004C22.36 11.9404 22.36 13.6504 20.79 14.7004Z"
          fill={color}
        />
        <path
          opacity="0.4"
          d="M6.44002 7.77C6.51002 7.76 6.58002 7.76 6.65002 7.77C8.20002 7.72 9.43002 6.45 9.43002 4.89C9.43002 3.3 8.14002 2 6.54002 2C4.95002 2 3.65002 3.29 3.65002 4.89C3.66002 6.45 4.89002 7.72 6.44002 7.77Z"
          fill={color}
        />
        <path
          opacity="0.4"
          d="M6.54999 12.8496C6.54999 13.8196 6.75999 14.7396 7.13999 15.5696C5.72999 15.7196 4.26 15.4196 3.18 14.7096C1.6 13.6596 1.6 11.9496 3.18 10.8996C4.25 10.1796 5.75999 9.88962 7.18 10.0496C6.77 10.8896 6.54999 11.8396 6.54999 12.8496Z"
          fill={color}
        />
        <path
          d="M12.12 15.87C12.04 15.86 11.95 15.86 11.86 15.87C10.02 15.81 8.54999 14.3 8.54999 12.44C8.54999 10.54 10.08 9 11.99 9C13.89 9 15.43 10.54 15.43 12.44C15.43 14.3 13.97 15.81 12.12 15.87Z"
          fill={color}
        />
        <path
          d="M8.86999 17.9396C7.35999 18.9496 7.35999 20.6096 8.86999 21.6096C10.59 22.7596 13.41 22.7596 15.13 21.6096C16.64 20.5996 16.64 18.9396 15.13 17.9396C13.42 16.7896 10.6 16.7896 8.86999 17.9396Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function RatingStarOutlineIcon({ size = 24, color = '#000000', className = '' }) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M13.7299 3.51063L15.4899 7.03063C15.7299 7.52063 16.3699 7.99063 16.9099 8.08063L20.0999 8.61062C22.1399 8.95062 22.6199 10.4306 21.1499 11.8906L18.6699 14.3706C18.2499 14.7906 18.0199 15.6006 18.1499 16.1806L18.8599 19.2506C19.4199 21.6806 18.1299 22.6206 15.9799 21.3506L12.9899 19.5806C12.4499 19.2606 11.5599 19.2606 11.0099 19.5806L8.01991 21.3506C5.87991 22.6206 4.57991 21.6706 5.13991 19.2506L5.84991 16.1806C5.97991 15.6006 5.74991 14.7906 5.32991 14.3706L2.84991 11.8906C1.38991 10.4306 1.85991 8.95062 3.89991 8.61062L7.08991 8.08063C7.61991 7.99063 8.25991 7.52063 8.49991 7.03063L10.2599 3.51063C11.2199 1.60063 12.7799 1.60063 13.7299 3.51063Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function RatingStarTapIcon({ size = 24, color = '#000000', className = '' }) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M11.9994 8.66998L12.6694 10.78H14.8894L13.1094 12.11L13.7794 14.22L11.9994 12.89L10.2194 14.22L10.8894 12.11L9.10938 10.78H11.3294L11.9994 8.66998Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.4"
          d="M2 12H3.11M20.89 12H22M12 22V20.89M12 3.11V2M19.11 4.89L16.44 7.56M7.56 7.56L4.89 4.89M7.56 16.44L4.89 19.11M19.11 19.11L16.44 16.44"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function RatingStarActiveIcon({ size = 24, color = '#000000', className = '' }) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <path opacity="0.4" d="M2 12H3.54" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path opacity="0.4" d="M20.5391 12H21.9991" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.92969 19.07L6.01969 17.98" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.0391 5.95999L19.0691 4.92999" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path opacity="0.4" d="M12 22V20.46" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path opacity="0.4" d="M12 3.46V2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.0705 19.07L17.9805 17.98" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.95969 5.95999L4.92969 4.92999" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M12.2807 7.53997L13.3607 10.46C13.3907 10.54 13.4607 10.61 13.5407 10.64L16.4607 11.72C16.7207 11.82 16.7207 12.19 16.4607 12.28L13.5407 13.36C13.4607 13.39 13.3907 13.46 13.3607 13.54L12.2807 16.46C12.1807 16.72 11.8107 16.72 11.7207 16.46L10.6407 13.54C10.6107 13.46 10.5407 13.39 10.4607 13.36L7.5407 12.28C7.2807 12.18 7.2807 11.81 7.5407 11.72L10.4607 10.64C10.5407 10.61 10.6107 10.54 10.6407 10.46L11.7207 7.53997C11.8207 7.27997 12.1907 7.27997 12.2807 7.53997Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function RatingStarThanksIcon({ size = 24, color = '#000000', className = '' }) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M12 22.75C11.61 22.75 11.28 22.45 11.25 22.06C10.61 13.65 10.35 13.39 1.94 12.75C1.55 12.72 1.25 12.39 1.25 12C1.25 11.61 1.55 11.28 1.94 11.25C10.35 10.61 10.61 10.35 11.25 1.94C11.28 1.55 11.61 1.25 12 1.25C12.39 1.25 12.72 1.55 12.75 1.94C13.39 10.35 13.65 10.61 22.06 11.25C22.45 11.28 22.75 11.61 22.75 12C22.75 12.39 22.45 12.72 22.06 12.75C13.65 13.39 13.39 13.65 12.75 22.06C12.72 22.45 12.39 22.75 12 22.75ZM7.82 12C10.25 12.62 11.38 13.75 12 16.18C12.62 13.74 13.75 12.62 16.18 12C13.75 11.38 12.62 10.25 12 7.82C11.38 10.26 10.25 11.38 7.82 12Z" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function HomeRatingIcon({ size = 24, baseColor = '#dbeafe', accentColor = '#f5c24b' }) {
  const clipId = useId();
  const bottomClipId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M13.7299 3.51063L15.4899 7.03063C15.7299 7.52063 16.3699 7.99063 16.9099 8.08063L20.0999 8.61062C22.1399 8.95062 22.6199 10.4306 21.1499 11.8906L18.6699 14.3706C18.2499 14.7906 18.0199 15.6006 18.1499 16.1806L18.8599 19.2506C19.4199 21.6806 18.1299 22.6206 15.9799 21.3506L12.9899 19.5806C12.4499 19.2606 11.5599 19.2606 11.0099 19.5806L8.01991 21.3506C5.87991 22.6206 4.57991 21.6706 5.13991 19.2506L5.84991 16.1806C5.97991 15.6006 5.74991 14.7906 5.32991 14.3706L2.84991 11.8906C1.38991 10.4306 1.85991 8.95062 3.89991 8.61062L7.08991 8.08063C7.61991 7.99063 8.25991 7.52063 8.49991 7.03063L10.2599 3.51063C11.2199 1.60063 12.7799 1.60063 13.7299 3.51063Z"
          stroke={baseColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${bottomClipId})`}>
          <path
            d="M13.7299 3.51063L15.4899 7.03063C15.7299 7.52063 16.3699 7.99063 16.9099 8.08063L20.0999 8.61062C22.1399 8.95062 22.6199 10.4306 21.1499 11.8906L18.6699 14.3706C18.2499 14.7906 18.0199 15.6006 18.1499 16.1806L18.8599 19.2506C19.4199 21.6806 18.1299 22.6206 15.9799 21.3506L12.9899 19.5806C12.4499 19.2606 11.5599 19.2606 11.0099 19.5806L8.01991 21.3506C5.87991 22.6206 4.57991 21.6706 5.13991 19.2506L5.84991 16.1806C5.97991 15.6006 5.74991 14.7906 5.32991 14.3706L2.84991 11.8906C1.38991 10.4306 1.85991 8.95062 3.89991 8.61062L7.08991 8.08063C7.61991 7.99063 8.25991 7.52063 8.49991 7.03063L10.2599 3.51063C11.2199 1.60063 12.7799 1.60063 13.7299 3.51063Z"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
        <clipPath id={bottomClipId}>
          <rect x="0" y="12" width="24" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Portfolio() {
  const [activeTech, setActiveTech] = useState('All');
  const [engagement, setEngagement] = useState(DEFAULT_ENGAGEMENT);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [starsAligned, setStarsAligned] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingStage, setRatingStage] = useState('select');
  const [showTapStarIcon, setShowTapStarIcon] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const closeTimerRef = useRef(null);
  const tapIconTimerRef = useRef(null);
  const location = useLocation();
  const navOffset = 96;
  // Fetch portfolio data
  const { 
    data: portfolioData, 
    isLoading: portfolioLoading,
    error: portfolioError 
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getPortfolio,
  });

  // Fetch achievements
  const {
    data: achievementsData,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementService.getAchievements,
  });

  // Fetch projects
  const { 
    data: projectsData, 
    isLoading: projectsLoading,
    error: projectsError 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const isLoading = portfolioLoading || projectsLoading || achievementsLoading;
  const error = portfolioError || projectsError || achievementsError;
  const portfolio = portfolioData?.data;
  const projects = projectsData?.data || [];
  const achievements = achievementsData?.data || [];
  const hasAchievements = achievements.length > 0;

  useEffect(() => {
    if (isLoading) return;
    const params = new URLSearchParams(location.search);
    const target = location.hash?.replace('#', '') || params.get('section');
    if (!target) return;

    const element = document.getElementById(target);
    if (!element) return;

    const timer = window.setTimeout(() => {
      const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });

      if (params.has('section') || location.hash) {
        params.delete('section');
        const query = params.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
        window.history.replaceState({}, '', nextUrl);
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [
    isLoading,
    location.search,
    location.hash,
    navOffset,
    projects.length,
    portfolio?.skills?.length,
    hasAchievements,
  ]);

  useEffect(() => {
    let isMounted = true;

    const syncEngagement = async () => {
      try {
        const visitResponse = await portfolioService.registerVisitor();
        if (isMounted && visitResponse?.data) {
          setEngagement(visitResponse.data);
          return;
        }
      } catch {
        // Best-effort tracking: fallback to summary endpoint.
      }

      try {
        const summaryResponse = await portfolioService.getEngagementSummary();
        if (isMounted && summaryResponse?.data) {
          setEngagement(summaryResponse.data);
        }
      } catch {
        // Keep safe defaults if engagement endpoints are temporarily unavailable.
      }
    };

    syncEngagement();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isRatingOpen) return undefined;

    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      setStarsAligned(true);
    }, 90);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      setStarsAligned(false);
    };
  }, [isRatingOpen]);

  useEffect(() => {
    if (!isRatingOpen || selectedRating === 0 || ratingStage !== 'select') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setRatingStage('feedback');
    }, 360);

    return () => window.clearTimeout(timer);
  }, [isRatingOpen, ratingStage, selectedRating]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (tapIconTimerRef.current) {
        window.clearTimeout(tapIconTimerRef.current);
      }
    },
    []
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">Failed to load portfolio data.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const techFilters = ['All', ...new Set(projects.flatMap((project) => project.techStack || []))];
  const totalFeatured = projects.filter((project) => project.featured).length;
  const filteredProjects =
    activeTech === 'All'
      ? projects
      : projects.filter((project) => project.techStack?.includes(activeTech));
  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);
  const stats = [
    { label: 'Projects', value: projects.length },
    { label: 'Featured', value: totalFeatured },
    { label: 'Skills', value: portfolio?.skills?.length || 0 },
  ];
  const needsFeedback = selectedRating > 0 && selectedRating <= 3;
  const feedbackValue = feedback.trim();
  const averageRating = Number(engagement?.averageRating || 0);
  const totalRatings = Number(engagement?.totalRatings || 0);
  const uniqueVisitors = Number(engagement?.uniqueVisitors || 0);
  const websiteUrl = normalizeExternalUrl(portfolio?.socialLinks?.website);
  const formattedVisitors = uniqueVisitors.toLocaleString();
  const formattedTotalRatings = totalRatings.toLocaleString();

  const resetRatingExperience = () => {
    if (tapIconTimerRef.current) {
      window.clearTimeout(tapIconTimerRef.current);
      tapIconTimerRef.current = null;
    }
    setSelectedRating(0);
    setRatingStage('select');
    setShowTapStarIcon(false);
    setFeedback('');
    setRatingError('');
    setIsSubmittingRating(false);
  };

  const openRatingExperience = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    resetRatingExperience();
    setIsRatingOpen(true);
  };

  const closeRatingExperience = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsRatingOpen(false);
    resetRatingExperience();
  };

  const handleStarSelect = (value) => {
    if (isSubmittingRating || ratingStage === 'thanks') return;
    if (tapIconTimerRef.current) {
      window.clearTimeout(tapIconTimerRef.current);
      tapIconTimerRef.current = null;
    }
    setSelectedRating(value);
    setRatingError('');
    setRatingStage('select');
    setShowTapStarIcon(true);
    tapIconTimerRef.current = window.setTimeout(() => {
      setShowTapStarIcon(false);
    }, 1500);
  };

  const handleFeedbackContinue = async () => {
    if (isSubmittingRating || selectedRating === 0) return;
    if (needsFeedback && !feedbackValue) {
      setRatingError('Please share the reason and improvement needed before continuing.');
      return;
    }

    try {
      setIsSubmittingRating(true);
      setRatingError('');

      const response = await portfolioService.submitRating({
        rating: selectedRating,
        feedback: feedbackValue,
      });

      if (response?.data) {
        setEngagement(response.data);
      }

      if (tapIconTimerRef.current) {
        window.clearTimeout(tapIconTimerRef.current);
        tapIconTimerRef.current = null;
      }
      setShowTapStarIcon(false);
      setRatingStage('thanks');

      closeTimerRef.current = window.setTimeout(() => {
        closeRatingExperience();
      }, 2100);
    } catch (submitError) {
      setRatingError(submitError.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div className="min-h-screen text-ink">
      <Navbar showAchievements={hasAchievements} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-ink text-white">
        <div className="absolute -top-40 -right-20 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-10 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ProfileSection portfolio={portfolio} stats={stats} />
        </div>
      </section>

      {/* Skills Section */}
      {portfolio?.skills?.length > 0 && (
        <section id="skills" className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <p className="section-kicker">Expertise</p>
                <h2 className="section-title mt-2">Skills in Motion</h2>
                <p className="text-gray-600 mt-3 max-w-2xl">
                  A focused blend of frontend polish, backend resilience, and product-minded delivery.
                </p>
              </div>
            </div>
            <SkillsSection skills={portfolio.skills} />
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {hasAchievements && (
        <AchievementsSection achievements={achievements} />
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div id="projects">
          <section className="py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2">
                {techFilters.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setActiveTech(tech)}
                    className={`project-filter-chip ${
                      activeTech === tech
                        ? 'project-filter-chip--active'
                        : 'project-filter-chip--idle'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {filteredProjects.length === 0 && (
            <section className="py-10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center neo-panel p-8">
                <h3 className="text-lg font-semibold text-ink">No projects match this filter</h3>
                <p className="text-gray-600 mt-2">Try another tech tag to explore more work.</p>
              </div>
            </section>
          )}
          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <section className="featured-projects-section relative py-20 overflow-hidden">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <p className="section-kicker featured-projects-kicker">Showcase</p>
                    <h2 className="section-title mt-2 featured-projects-title">Featured Builds</h2>
                    <p className="featured-projects-subtitle mt-3 max-w-2xl">
                      A curated set of projects highlighting depth, polish, and measurable impact.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} featured />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Projects Section */}
          {otherProjects.length > 0 && (
            <section className="py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <p className="section-kicker">Archive</p>
                    <h2 className="section-title mt-2">More Projects</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl">
                      Additional builds that showcase consistency, speed, and adaptability.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* No Projects Message */}
      {projects.length === 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center neo-panel p-10">
            <h2 className="text-2xl font-bold text-ink mb-4">Projects Coming Soon</h2>
            <p className="text-gray-600">Check back later for exciting projects!</p>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-ink text-white" id="contact">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-kicker text-primary-200">Connect</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let&apos;s Build Something Remarkable</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Interested in working together? Reach out and let&apos;s map the next launch.
          </p>

          <div className="contact-insights mx-auto">
            <div className="contact-insight-card">
              <div className="contact-insight-main">
                <div className="contact-insight-icon">
                  <VisitorIcon size={20} color="#e2f8ff" />
                </div>
                <div className="contact-insight-meta">
                  <p className="contact-insight-label">Visitors</p>
                  <p className="contact-insight-value">{formattedVisitors}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openRatingExperience}
              className="contact-insight-card contact-insight-card--action"
            >
              <div className="contact-insight-main">
                <div className="contact-insight-icon">
                  <HomeRatingIcon size={20} baseColor="#dbeafe" accentColor="#f5c24b" />
                </div>
                <div className="contact-insight-meta">
                  <p className="contact-insight-label">Appreciation</p>
                  <p className="contact-insight-value">{averageRating.toFixed(1)} / 5.0 ({formattedTotalRatings})</p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-center items-center gap-6 flex-wrap">
            {portfolio?.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
              >
                <FiMail className="h-5 w-5" />
                {portfolio.email}
              </a>
            )}
            {portfolio?.location && (
              <span className="flex items-center gap-2 text-gray-300">
                <FiMapPin className="h-5 w-5" />
                {portfolio.location}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-8">
            {portfolio?.socialLinks?.github && (
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiGithub className="h-6 w-6" />
              </a>
            )}
            {portfolio?.socialLinks?.linkedin && (
              <a
                href={portfolio.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiLinkedin className="h-6 w-6" />
              </a>
            )}
            {portfolio?.socialLinks?.twitter && (
              <a
                href={portfolio.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
            )}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <WebsiteLinkIcon website={websiteUrl} className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </section>

      {isRatingOpen && (
        <div className="appreciation-overlay">
          <div className="appreciation-shell font-mono">
            <button
              type="button"
              onClick={closeRatingExperience}
              className="appreciation-close"
              aria-label="Close appreciation"
            >
              Close
            </button>

            <h3 className="text-xl md:text-2xl font-bold text-white mt-2">
              {ratingStage === 'thanks' ? 'Thanks for the feedback' : 'Tap a star to rate this portfolio'}
            </h3>

            <div className={`appreciation-star-orbit ${starsAligned ? 'appreciation-star-orbit--aligned' : ''}`}>
              {STAR_LAYOUT.map((star, index) => {
                const isActive = selectedRating >= index + 1;
                const showThanksIcon = ratingStage === 'thanks' && isActive;
                const showTapIcon = showTapStarIcon && isActive;
                const showActiveIcon = isActive && !showThanksIcon && !showTapIcon;
                const iconColor = isActive ? '#fcd34d' : '#dbeafe';

                return (
                  <button
                    key={`rate-star-${index + 1}`}
                    type="button"
                    onClick={() => handleStarSelect(index + 1)}
                    className={`appreciation-star ${
                      isActive ? 'appreciation-star--active' : ''
                    } ${showTapIcon ? 'appreciation-star--pulse' : ''} ${
                      ratingStage === 'thanks' ? 'appreciation-star--pile' : ''
                    }`}
                    disabled={isSubmittingRating || ratingStage === 'thanks'}
                    style={{
                      '--scatter-x': star.scatterX,
                      '--scatter-y': star.scatterY,
                      '--row-x': star.rowX,
                      '--wobble-delay': star.wobbleDelay,
                    }}
                    aria-label={`Rate ${index + 1} star${index === 0 ? '' : 's'}`}
                  >
                    {showThanksIcon ? (
                      <RatingStarThanksIcon size={30} color={iconColor} className="appreciation-star-shape" />
                    ) : showTapIcon ? (
                      <RatingStarTapIcon
                        size={30}
                        color={iconColor}
                        className="appreciation-star-shape appreciation-star-shape--tap"
                      />
                    ) : showActiveIcon ? (
                      <RatingStarActiveIcon size={30} color={iconColor} className="appreciation-star-shape" />
                    ) : (
                      <RatingStarOutlineIcon size={30} color={iconColor} className="appreciation-star-shape" />
                    )}
                  </button>
                );
              })}
            </div>

            {ratingStage === 'feedback' && selectedRating > 0 && (
              <div className="appreciation-feedback-panel">
                <textarea
                  value={feedback}
                  onChange={(event) => {
                    setFeedback(event.target.value);
                    setRatingError('');
                  }}
                  placeholder={
                    needsFeedback
                      ? 'What is the reason and what improvement is needed?'
                      : 'Any suggestions to make this even better?'
                  }
                  className="appreciation-feedback-input"
                  required={needsFeedback}
                />

                {ratingError && <p className="text-xs text-red-200 mt-2">{ratingError}</p>}

                {(selectedRating >= 4 || feedbackValue.length > 0) && (
                  <button
                    type="button"
                    className="appreciation-feedback-continue"
                    onClick={handleFeedbackContinue}
                    disabled={isSubmittingRating}
                  >
                    {isSubmittingRating ? 'Submitting...' : 'click to continue'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Portfolio;


