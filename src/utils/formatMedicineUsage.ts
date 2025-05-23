interface FormattedSection {
  title: string;
  content: string[];
}

export const formatMedicineUsage = (usage: string): string => {
  const sections = usage
    .split('###')
    .map(section => {
      if (!section.trim()) return null;
      const [title, ...content] = section.split('\n');
      return {
        title: title.replace(/\*\*/g, '').trim(),
        content: content
          .filter(line => line.trim())
          .map(line => line.replace(/^\s*-\s*/, '').replace(/\*\*/g, ''))
      };
    })
    .filter((section): section is FormattedSection => section !== null);

  return sections
    .map(section => {
      return `### ${section.title}\n${section.content.map(line => `- ${line}`).join('\n')}`;
    })
    .join('\n\n');
}; 