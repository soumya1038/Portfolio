const categoryColors = {
  Frontend: 'from-primary-50 to-white text-primary-700 border-primary-100',
  Backend: 'from-accent-50 to-white text-accent-700 border-accent-100',
  Database: 'from-emerald-50 to-white text-emerald-700 border-emerald-100',
  DevOps: 'from-sky-50 to-white text-sky-700 border-sky-100',
  Mobile: 'from-rose-50 to-white text-rose-700 border-rose-100',
  Other: 'from-gray-50 to-white text-gray-700 border-gray-200',
};

function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category}
            className={`neo-panel p-5 border bg-gradient-to-br ${categoryColors[category] || categoryColors.Other}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{category}</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                {groupedSkills[category].length} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupedSkills[category].map((skill) => (
                <span
                  key={skill._id || skill.name}
                  className="px-3 py-1 rounded-full bg-white text-sm font-medium shadow-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;
