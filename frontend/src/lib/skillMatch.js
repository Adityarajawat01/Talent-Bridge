const normalizeSkill = (skill) =>
  String(skill || "")
    .toLowerCase()
    .trim();

const normalizeSkillList = (skills) => {
  if (!skills) return [];

  const skillList = Array.isArray(skills) ? skills : String(skills).split(",");

  return [...new Set(skillList.map(normalizeSkill).filter(Boolean))];
};

export const calculateSkillMatch = (userSkills, requiredSkills) => {
  const normalizedUserSkills = normalizeSkillList(userSkills);
  const normalizedRequiredSkills = normalizeSkillList(requiredSkills);

  if (!normalizedUserSkills.length || !normalizedRequiredSkills.length) {
    return {
      matchedSkills: [],
      missingSkills: normalizedRequiredSkills,
      percentage: 0,
      totalRequired: normalizedRequiredSkills.length,
    };
  }

  const userSkillSet = new Set(normalizedUserSkills);
  const matchedSkills = normalizedRequiredSkills.filter((skill) =>
    userSkillSet.has(skill),
  );
  const missingSkills = normalizedRequiredSkills.filter(
    (skill) => !userSkillSet.has(skill),
  );

  return {
    matchedSkills,
    missingSkills,
    percentage: Math.round(
      (matchedSkills.length / normalizedRequiredSkills.length) * 100,
    ),
    totalRequired: normalizedRequiredSkills.length,
  };
};

export const getSkillMatchTone = (percentage) => {
  if (percentage >= 80) return "high";
  if (percentage >= 50) return "medium";
  return "low";
};
