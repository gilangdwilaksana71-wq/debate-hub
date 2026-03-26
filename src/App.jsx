import { useMemo, useState } from 'react';
import motions from './motions.json';

export default function App() {
  const [memberInput, setMemberInput] = useState('');
  const [teams, setTeams] = useState(null);
  const [groupType, setGroupType] = useState('team'); // 'team' or 'individual'
  const [category, setCategory] = useState('custom');
  const [customCategory, setCustomCategory] = useState('');
  const [motion, setMotion] = useState(null);
  const [language, setLanguage] = useState('id');

  const categories = useMemo(
    () => [
      { value: 'custom', label: 'Bebas' },
      { value: 'politics', label: 'Politik' },
      { value: 'economy', label: 'Ekonomi' },
      { value: 'technology', label: 'Teknologi' },
      { value: 'international', label: 'Hubungan Internasional' },
      { value: 'religion', label: 'Agama' },
      { value: 'science', label: 'Sains' },
      { value: 'social', label: 'Gerakan Sosial' },
      { value: 'art', label: 'Seni' },
      { value: 'law', label: 'Hukum' },
      { value: 'psychology', label: 'Psikologi' },
      { value: 'philosophy', label: 'Filosofi' },
      { value: 'pop', label: 'Pop Culture' },
      { value: 'culture', label: 'Budaya' },
      { value: 'love', label: 'Cinta' },
      { value: 'education', label: 'Pendidikan' },
      { value: 'sports', label: 'Olahraga' },
    ],
    []
  );

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildMembers(input) {
    const byNewline = input
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (byNewline.length > 1) {
      return byNewline.flatMap((line) => line.split(',').map((p) => p.trim())).filter(Boolean);
    }

    return input
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
  }

  function generateTeams() {
    const list = buildMembers(memberInput);
    const minCount = groupType === 'team' ? 4 : 8;

    if (list.length < minCount) {
      alert(`Masukkan minimal ${minCount} ${groupType === 'team' ? 'nama tim' : 'nama individu'}.`);
      return;
    }

    const shuffled = shuffle(list);

    if (groupType === 'team') {
      setTeams({
        OG: [shuffled[0]],
        OO: [shuffled[1]],
        CG: [shuffled[2]],
        CO: [shuffled[3]],
        remaining: shuffled.slice(4),
      });
    } else {
      setTeams({
        OG: shuffled.slice(0, 2),
        OO: shuffled.slice(2, 4),
        CG: shuffled.slice(4, 6),
        CO: shuffled.slice(6, 8),
        remaining: shuffled.slice(8),
      });
    }
  }

  function getMotionTranslated(selected) {
    if (!selected) return null;
    if (language === 'id') {
      return selected.motion_id || selected.motion;
    }
    return selected.motion;
  }

  function generateMotion() {
    if (category === 'custom') {
      if (!customCategory.trim()) {
        alert('Isi topik bebas sebelum generate mosi.');
        return;
      }
      setMotion({
        en: `This House akan membahas: ${customCategory}`,
        id: `Dewan ini akan membahas: ${customCategory}`,
      });
      return;
    }

    const filtered = motions.filter((item) => item.category === category);
    if (!filtered.length) {
      setMotion(null);
      return;
    }

    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    setMotion({
      en: selected.motion,
      id: getMotionTranslated(selected),
    });
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">ClashMate BP Debate Generator</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Mode Input</h2>
        <div className="mb-2">
          <label className="mr-4">
            <input
              type="radio"
              name="groupType"
              value="team"
              checked={groupType === 'team'}
              onChange={() => setGroupType('team')}
            />
            {' '}Tim (4 nama tim)
          </label>
          <label>
            <input
              type="radio"
              name="groupType"
              value="individual"
              checked={groupType === 'individual'}
              onChange={() => setGroupType('individual')}
            />
            {' '}Individu (8 nama individu)
          </label>
        </div>

        <h2 className="font-semibold">Input Nama Tim/Individu (pisahkan newline atau koma)</h2>
        <textarea
          className="w-full border p-2 rounded"
          rows={6}
          value={memberInput}
          onChange={(e) => setMemberInput(e.target.value)}
          placeholder={groupType === 'team' ? 'Contoh:\nTim A\nTim B\nTim C\nTim D' : 'Contoh:\nOrang 1\nOrang 2\n...\nOrang 8'}
        />
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={generateTeams}>
          Generate Tim (OG/OO/CG/CO)
        </button>
      </section>

      {teams && (
        <section className="mb-6">
          <h2 className="font-semibold">Hasil Pembagian Tim</h2>
          {['OG', 'OO', 'CG', 'CO'].map((role) => (
            <div key={role}>
              <strong>{role}</strong>: {teams[role]?.join(', ') || '-'}
            </div>
          ))}
          {teams.remaining.length > 0 && (
            <div>
              <strong>Remaining</strong>: {teams.remaining.join(', ')}
            </div>
          )}
        </section>
      )}

      <section className="mb-6">
        <h2 className="font-semibold">Pilih Kategori Mosi</h2>
        <select
          className="border p-2 rounded mr-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {category === 'custom' && (
          <input
            type="text"
            className="border p-2 rounded mr-2"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Masukkan topik bebas"
          />
        )}

        <select
          className="border p-2 rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>

        <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded" onClick={generateMotion}>
          Generate Mosi
        </button>
      </section>

      {motion && (
        <section>
          <h2 className="font-semibold">Mosi</h2>
          <p><strong>EN:</strong> {motion.en}</p>
          <p><strong>ID:</strong> {motion.id}</p>
        </section>
      )}
    </div>
  );
}
