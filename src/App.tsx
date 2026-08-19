import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import {
  ArrowUpRight, BookOpen, Camera, Check, ChevronRight, CircleHelp, Compass, Download, Filter,
  Globe2, LayoutDashboard, Map, MapPinned, Medal, Plus, Search, Settings2, Sparkles, Star,
  Trophy, Upload, X,
} from 'lucide-react'
import { COUNTRY_COUNT, COUNTRIES, Country, featuredCountries, getCountry, regionCounts, Region } from './data/countries'
import { Memory, starterMemories } from './data/memories'

type View = 'overview' | 'countries' | 'journal' | 'goals'
type ModalMode = 'memory' | 'country' | null
type Language = 'en' | 'ru'

const copy = {
  en: {
    atlas: 'personal atlas', navOverview: 'Overview', navCountries: 'Countries', navJournal: 'Journal', navGoals: 'Goals', route: 'My route',
    explorer: 'explorer', settings: 'Settings', smallStep: 'A small step', nextCountryWaits: 'Your next country is waiting.',
    date: 'Friday, August 14, 2026', worldInMotion: 'Your world in motion', findCountry: 'Find a country', help: 'Help', add: 'Add',
    yourPath: 'YOUR PATH', worldCloser: 'The world gets', closer: 'closer.', intro: 'Mark places, keep moments', intro2: 'and build your own geography.', latest: 'LATEST MOMENTS', travelJournal: 'Travel journal', allEntries: 'All entries',
    addMemory: 'Add a memory', photoNote: 'Photo, note, or a new route', nextUp: 'UP NEXT', countriesToFinish: 'More horizons ahead', collect: 'Build a collection you cannot forget.', addCountry: 'Add country',
    worldMap: 'World map', clickPoint: 'Click a point to open its story', all: 'All', visitedOnly: 'Visited only', filters: 'Filters', visited: 'Visited', planned: 'Planned', mapAlt: 'Interactive stylized world map',
    progress: 'Progress', exportProgress: 'Export progress', explored: 'explored', countriesMarked: 'countries marked in your atlas', nextGoal: 'Next goal', newHorizon: 'new horizon', xp: '+120 XP to the next level', level: 'Level 04',
    countries: 'countries', memories: 'memories', avgRating: 'average rating', worldRank: 'world ranking', perMonth: 'this month', outOf: 'out of', rankChange: '↑ 14 places', placesSentence: 'Places stay with us when they have a story.',
    collection: 'COLLECTION', allCountries: 'All countries', collectionNote: '195 countries, one route for a lifetime.', marked: 'marked', searchCountries: 'Search countries', allRegions: 'All regions', extraFilters: 'More filters', shown80: 'Showing the first 80 results. Refine your search to find a specific country.', mark: 'Mark',
    memory: 'MEMORY', journalTitle: 'Travel journal', journalNote: 'Places stay with us when they have a story.', newEntry: 'New entry',
    longRoute: 'THE LONG ROUTE', goalsTitle: 'Goals & achievements', goalsNote: 'Every mark becomes a story.', exploredWorld: 'of the world explored', overall: 'Overall progress', nextLevel: 'Five more countries to reach the next level', reached: 'Reached', inProgress: 'In progress',
    countryCard: 'COUNTRY CARD', youWereHere: 'You were here', markedInAtlas: 'Marked in your atlas', stillAhead: 'Still ahead', addToRoute: 'Add it to your route', visitedButton: 'Visited', markVisited: 'Mark as visited', impressions: 'Memories', emptyMemory: 'Nothing here yet. Add the first story.', personalRating: 'Personal rating',
    newMemory: 'NEW MEMORY', saveMoment: 'Save a moment', country: 'Country', title: 'Title', memoryPrompt: 'What do you want to remember?', photoUrl: 'Photo URL', optional: 'optional', rating: 'Rating', cancel: 'Cancel', save: 'Save',
    newMark: 'NEW MARK', whereBeen: 'Where have you been?', countryNotFound: 'No country found, or it is already marked.',
  },
  ru: {
    atlas: 'личный атлас', navOverview: 'Обзор', navCountries: 'Страны', navJournal: 'Журнал', navGoals: 'Цели', route: 'Мой маршрут',
    explorer: 'исследователь', settings: 'Настройки', smallStep: 'Маленький шаг', nextCountryWaits: 'Следующая страна уже ждёт.',
    date: 'Пятница, 14 августа 2026', worldInMotion: 'Твой мир в движении', findCountry: 'Найти страну', help: 'Помощь', add: 'Добавить',
    yourPath: 'ТВОЙ ПУТЬ', worldCloser: 'Мир становится', closer: 'ближе.', intro: 'Отмечай места, сохраняй моменты', intro2: 'и собирай свою географию.', latest: 'ПОСЛЕДНИЕ МОМЕНТЫ', travelJournal: 'Журнал путешествий', allEntries: 'Все записи',
    addMemory: 'Добавить впечатление', photoNote: 'Фото, заметка или новый маршрут', nextUp: 'ДАЛЬШЕ ПО ПЛАНУ', countriesToFinish: 'Ещё горизонты впереди', collect: 'Собери коллекцию, которую невозможно забыть.', addCountry: 'Добавить страну',
    worldMap: 'Карта мира', clickPoint: 'Нажми на точку, чтобы открыть запись', all: 'Все', visitedOnly: 'Только посещённые', filters: 'Фильтры', visited: 'Посещено', planned: 'В планах', mapAlt: 'Интерактивная стилизованная карта мира',
    progress: 'Прогресс', exportProgress: 'Экспортировать прогресс', explored: 'исследовано', countriesMarked: 'стран отмечено в атласе', nextGoal: 'Следующая цель', newHorizon: 'новый горизонт', xp: '+120 XP до нового уровня', level: 'Уровень 04',
    countries: 'страны', memories: 'впечатления', avgRating: 'средняя оценка', worldRank: 'мировой рейтинг', perMonth: 'за месяц', outOf: 'из', rankChange: '↑ 14 мест', placesSentence: 'Места остаются в памяти, когда у них есть история.',
    collection: 'КОЛЛЕКЦИЯ', allCountries: 'Все страны', collectionNote: '195 стран, один маршрут на всю жизнь.', marked: 'отмечено', searchCountries: 'Поиск по странам', allRegions: 'Все регионы', extraFilters: 'Дополнительные фильтры', shown80: 'Показаны первые 80 результатов. Уточни поиск, чтобы увидеть точную запись.', mark: 'Отметить',
    memory: 'ПАМЯТЬ', journalTitle: 'Журнал путешествий', journalNote: 'Места остаются в памяти, когда у них есть история.', newEntry: 'Новая запись',
    longRoute: 'ДОЛГИЙ МАРШРУТ', goalsTitle: 'Цели и достижения', goalsNote: 'Каждая отметка превращается в историю.', exploredWorld: 'мира исследовано', overall: 'Общий прогресс', nextLevel: 'Ещё 5 стран до следующего уровня', reached: 'Достигнуто', inProgress: 'В процессе',
    countryCard: 'КАРТОЧКА СТРАНЫ', youWereHere: 'Ты был здесь', markedInAtlas: 'Отмечено в твоём атласе', stillAhead: 'Ещё впереди', addToRoute: 'Добавь страну в маршрут', visitedButton: 'Посещено', markVisited: 'Отметить как посещённую', impressions: 'Впечатления', emptyMemory: 'Пока пусто. Добавь первую историю.', personalRating: 'Личная оценка',
    newMemory: 'НОВАЯ ЗАПИСЬ', saveMoment: 'Сохрани момент', country: 'Страна', title: 'Заголовок', memoryPrompt: 'Что хочется запомнить?', photoUrl: 'Ссылка на фото', optional: 'необязательно', rating: 'Оценка', cancel: 'Отмена', save: 'Сохранить',
    newMark: 'НОВАЯ ОТМЕТКА', whereBeen: 'Где ты был?', countryNotFound: 'Такой страны нет в списке или она уже отмечена.',
  },
} as const

type Copy = { [Key in keyof typeof copy.en]: string }

const seedVisited = ['португалия', 'испания', 'франция', 'великобритания', 'италия', 'греция', 'турция', 'египет', 'южная-африка', 'индия', 'таиланд', 'япония', 'австралия', 'сша', 'мексика', 'бразилия', 'аргентина', 'марокко', 'непал', 'новая-зеландия']

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [activeView, setActiveView] = useState<View>('overview')
  const [language, setLanguage] = useState<Language>(() => readStorage('atlas-language', 'en'))
  const [visitedIds, setVisitedIds] = useState<string[]>(() => readStorage('atlas-visited', seedVisited))
  const [memories, setMemories] = useState<Memory[]>(() => readStorage('atlas-memories', starterMemories))
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all')

  useEffect(() => window.localStorage.setItem('atlas-visited', JSON.stringify(visitedIds)), [visitedIds])
  useEffect(() => window.localStorage.setItem('atlas-memories', JSON.stringify(memories)), [memories])

  const visitedSet = useMemo(() => new Set(visitedIds), [visitedIds])
  const visitedCount = visitedIds.length
  const progress = Math.round((visitedCount / COUNTRY_COUNT) * 100)
  const memoryCountries = new Set(memories.map((memory) => memory.countryId))
  const selectedCountry = selectedCountryId ? getCountry(selectedCountryId) : undefined
  const c = copy[language]

  useEffect(() => {
    window.localStorage.setItem('atlas-language', language)
    document.documentElement.lang = language
  }, [language])

  const toggleVisited = (countryId: string) => {
    setVisitedIds((current) => current.includes(countryId) ? current.filter((id) => id !== countryId) : [...current, countryId])
  }

  const openCountry = (countryId: string) => {
    setSelectedCountryId(countryId)
  }

  const addMemory = (memory: Memory) => {
    setMemories((current) => [memory, ...current])
    if (!visitedSet.has(memory.countryId)) setVisitedIds((current) => [...current, memory.countryId])
    setModalMode(null)
  }

  const filteredCountries = useMemo(() => COUNTRIES.filter((country) => {
    const matchesSearch = country.name.toLocaleLowerCase('ru-RU').includes(searchQuery.toLocaleLowerCase('ru-RU'))
    const matchesRegion = regionFilter === 'all' || country.region === regionFilter
    return matchesSearch && matchesRegion
  }), [regionFilter, searchQuery])

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onChange={setActiveView} visitedCount={visitedCount} c={c} />
      <main className="main-content">
        <Topbar searchQuery={searchQuery} onSearch={setSearchQuery} onAdd={() => setModalMode('memory')} language={language} onLanguage={() => setLanguage(language === 'en' ? 'ru' : 'en')} c={c} />
        {activeView === 'overview' && (
          <Overview
            visitedSet={visitedSet}
            visitedCount={visitedCount}
            progress={progress}
            memories={memories}
            memoryCountries={memoryCountries}
            onOpenCountry={openCountry}
            onAdd={() => setModalMode('memory')}
            c={c}
          />
        )}
        {activeView === 'countries' && (
          <CountriesView
            filteredCountries={filteredCountries}
            visitedSet={visitedSet}
            regionFilter={regionFilter}
            onRegion={setRegionFilter}
            onToggle={toggleVisited}
            onOpen={openCountry}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            c={c}
          />
        )}
        {activeView === 'journal' && (
          <JournalView memories={memories} onOpenCountry={openCountry} onAdd={() => setModalMode('memory')} c={c} />
        )}
        {activeView === 'goals' && <GoalsView visitedCount={visitedCount} progress={progress} visitedSet={visitedSet} onAdd={() => setModalMode('country')} c={c} />}
      </main>
      {selectedCountry && (
        <CountryDrawer
          country={selectedCountry}
          visited={visitedSet.has(selectedCountry.id)}
          memories={memories.filter((memory) => memory.countryId === selectedCountry.id)}
          onClose={() => setSelectedCountryId(null)}
          onToggle={() => toggleVisited(selectedCountry.id)}
          onAddMemory={() => setModalMode('memory')}
          c={c}
        />
      )}
      {modalMode === 'memory' && <MemoryModal onClose={() => setModalMode(null)} onSubmit={addMemory} c={c} />}
      {modalMode === 'country' && <CountryPickerModal visitedSet={visitedSet} onClose={() => setModalMode(null)} onToggle={(id) => { toggleVisited(id); setModalMode(null) }} c={c} />}
    </div>
  )
}

function Sidebar({ activeView, onChange, visitedCount, c }: { activeView: View; onChange: (view: View) => void; visitedCount: number; c: Copy }) {
  const items: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: c.navOverview, icon: LayoutDashboard },
    { id: 'countries', label: c.navCountries, icon: Map },
    { id: 'journal', label: c.navJournal, icon: BookOpen },
    { id: 'goals', label: c.navGoals, icon: Trophy },
  ]
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark"><Compass size={20} strokeWidth={1.8} /></span>
        <span><strong>atlas</strong><small>{c.atlas}</small></span>
      </div>
      <div className="sidebar-heading">{c.route}</div>
      <nav className="sidebar-nav" aria-label="Основная навигация">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${activeView === id ? 'is-active' : ''}`} onClick={() => onChange(id)}>
            <Icon size={18} strokeWidth={1.7} /><span>{label}</span>{id === 'journal' && <span className="nav-count">{visitedCount > 12 ? '3' : '0'}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-tip">
        <Sparkles size={16} />
        <p><strong>{c.smallStep}</strong><br />{c.nextCountryWaits}</p>
        <ArrowUpRight size={15} />
      </div>
      <div className="profile-row">
        <div className="avatar">А</div>
        <div><strong>Alex</strong><span>{c.explorer}</span></div>
        <button className="icon-button subtle" title={c.settings}><Settings2 size={16} /></button>
      </div>
    </aside>
  )
}

function Topbar({ searchQuery, onSearch, onAdd, language, onLanguage, c }: { searchQuery: string; onSearch: (value: string) => void; onAdd: () => void; language: Language; onLanguage: () => void; c: Copy }) {
  return (
    <header className="topbar">
      <div className="breadcrumb"><span>{c.date}</span><span className="breadcrumb-dot" /> <span className="muted">{c.worldInMotion}</span></div>
      <div className="topbar-actions">
        <label className="search-field"><Search size={16} /><input value={searchQuery} onChange={(event) => onSearch(event.target.value)} placeholder={c.findCountry} aria-label={c.findCountry} /><kbd>⌘ K</kbd></label>
        <button className="language-toggle" onClick={onLanguage} title="Switch language">{language.toUpperCase()}</button>
        <button className="icon-button" title={c.help}><CircleHelp size={18} /></button>
        <button className="primary-button compact" onClick={onAdd}><Plus size={17} />{c.add}</button>
      </div>
    </header>
  )
}

function Overview({ visitedSet, visitedCount, progress, memories, memoryCountries, onOpenCountry, onAdd, c }: {
  visitedSet: Set<string>; visitedCount: number; progress: number; memories: Memory[]; memoryCountries: Set<string>; onOpenCountry: (id: string) => void; onAdd: () => void; c: Copy
}) {
  return (
    <div className="page page-overview">
      <div className="page-intro">
        <div><p className="eyebrow">{c.yourPath}</p><h1>{c.worldCloser}<br /><em>{c.closer}</em></h1></div>
        <p className="intro-copy">{c.intro}<br />{c.intro2}</p>
      </div>
      <section className="overview-grid">
        <MapPanel visitedSet={visitedSet} onOpenCountry={onOpenCountry} c={c} />
        <ProgressPanel visitedSet={visitedSet} visitedCount={visitedCount} progress={progress} onAdd={onAdd} c={c} />
      </section>
      <StatsStrip visitedCount={visitedCount} memoriesCount={memories.length} c={c} />
      <section className="journal-block">
        <div className="section-head"><div><p className="eyebrow">{c.latest}</p><h2>{c.travelJournal}</h2></div><button className="text-button" onClick={onAdd}>{c.allEntries} <ChevronRight size={16} /></button></div>
        <div className="memory-grid">
          {memories.slice(0, 3).map((memory) => <MemoryCard key={memory.id} memory={memory} onOpenCountry={onOpenCountry} />)}
          <button className="add-memory-card" onClick={onAdd}><span className="add-circle"><Plus size={20} /></span><strong>{c.addMemory}</strong><span>{c.photoNote}</span></button>
        </div>
      </section>
      <section className="next-section">
        <div><p className="eyebrow">{c.nextUp}</p><h2>{c.countriesToFinish}</h2><p>{c.collect}</p></div>
        <div className="route-line"><span className="route-node visited" /><span className="route-segment filled" /><span className="route-node current" /><span className="route-segment" /><span className="route-node" /><span className="route-segment" /><span className="route-node" /></div>
        <button className="round-arrow" onClick={onAdd} title={c.addCountry}><ArrowUpRight size={18} /></button>
      </section>
    </div>
  )
}

function MapPanel({ visitedSet, onOpenCountry, c }: { visitedSet: Set<string>; onOpenCountry: (id: string) => void; c: Copy }) {
  const [mapMode, setMapMode] = useState<'atlas' | 'geo'>('atlas')
  return (
    <section className="map-panel panel-surface">
      <div className="panel-head"><div><span className="panel-title"><Globe2 size={17} />{c.worldMap}</span><span className="panel-subtitle">{c.clickPoint}</span></div><div className="map-tools"><button className={`map-tool ${mapMode === 'atlas' ? 'is-selected' : ''}`} onClick={() => setMapMode('atlas')}>Atlas</button><button className={`map-tool ${mapMode === 'geo' ? 'is-selected' : ''}`} onClick={() => setMapMode('geo')}>Geo</button><button className="map-tool is-selected">{c.all}</button><button className="map-tool">{c.visitedOnly}</button><button className="icon-button small" title={c.filters}><Filter size={15} /></button></div></div>
      <div className={`world-map ${mapMode === 'geo' ? 'is-geographic' : ''}`} role="application" aria-label={c.mapAlt}>
        <svg viewBox="0 0 900 480" preserveAspectRatio="xMidYMid meet">
          <defs><pattern id="map-grid" width="72" height="48" patternUnits="userSpaceOnUse"><path d="M 72 0 L 0 0 0 48" fill="none" stroke="rgba(190,230,225,.055)" strokeWidth="1" /></pattern></defs>
          <rect width="900" height="480" fill="url(#map-grid)" />
          <g className="continent-shapes">
            <path d="M80 128 C111 98 183 99 230 137 L247 185 217 225 183 214 164 249 128 232 107 198 74 187 66 154Z" />
            <path d="M216 264 C253 248 289 269 307 315 L287 360 270 425 233 395 235 346 207 304Z" />
            <path d="M306 125 C346 99 423 103 470 124 L498 160 483 196 444 205 422 240 379 237 350 213 309 191 290 154Z" />
            <path d="M439 239 C469 225 506 236 532 268 L524 323 490 363 459 341 449 302 423 278Z" />
            <path d="M489 120 C548 85 660 95 724 139 L806 156 850 206 792 238 734 221 697 248 650 234 614 260 575 226 531 212 502 174Z" />
            <path d="M652 294 C695 276 755 293 782 329 L780 390 744 417 687 408 662 370 626 350Z" />
            <path d="M799 356 C832 349 855 365 867 392 L844 431 809 416 790 390Z" />
          </g>
          <g className="map-labels"><text x="104" y="285">AMERICAS</text><text x="366" y="154">EUROPE</text><text x="545" y="275">ASIA</text><text x="431" y="385">AFRICA</text><text x="691" y="447">OCEANIA</text></g>
        </svg>
        {featuredCountries.map((country) => {
          const visited = visitedSet.has(country.id)
          return <button key={country.id} className={`map-marker ${visited ? 'visited' : ''}`} style={{ left: `${(country.mapX! / 900) * 100}%`, top: `${(country.mapY! / 480) * 100}%` }} onClick={() => onOpenCountry(country.id)} aria-label={`${country.name}, ${visited ? c.visited : c.planned}`}><span className="marker-pulse" /><span className="marker-dot" />{country.mapLabel && <span className="marker-label">{country.mapLabel}</span>}</button>
        })}
        <div className="map-legend"><span><i className="legend-dot visited" />{c.visited}</span><span><i className="legend-dot" />{c.planned}</span></div>
      </div>
    </section>
  )
}

function ProgressPanel({ visitedSet, visitedCount, progress, onAdd, c }: { visitedSet: Set<string>; visitedCount: number; progress: number; onAdd: () => void; c: Copy }) {
  const next = COUNTRIES.find((country) => !visitedSet.has(country.id)) ?? COUNTRIES[0]
  return (
    <section className="progress-panel panel-surface"><div className="panel-head"><span className="panel-title"><Medal size={17} />{c.progress}</span><button className="icon-button small" title={c.exportProgress}><Download size={15} /></button></div><div className="progress-orbit"><div className="progress-ring" style={{ '--progress': `${progress}%` } as CSSProperties}><div className="progress-ring-inner"><strong>{progress}<small>%</small></strong><span>{c.explored}</span></div></div><div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" /></div><div className="progress-copy"><strong>{visitedCount} <span>/ {COUNTRY_COUNT}</span></strong><p>{c.countriesMarked}</p></div><div className="next-country"><div><span>{c.nextGoal}</span><strong>{next.name}</strong><small>{next.region} · {memoryText(next.id, c)}</small></div><button className="round-arrow" onClick={onAdd} title={c.addCountry}><ArrowUpRight size={18} /></button></div><div className="progress-foot"><span><Sparkles size={14} />{c.xp}</span><span>{c.level}</span></div></section>
  )
}

const memoryText = (countryId: string, c: Copy) => countryId === 'непал' ? (c === copy.en ? 'the Himalayas call' : 'Гималаи зовут') : c.newHorizon

function StatsStrip({ visitedCount, memoriesCount, c }: { visitedCount: number; memoriesCount: number; c: Copy }) {
  return <div className="stats-strip"><div className="stat"><span className="stat-icon mint"><MapPinned size={17} /></span><div><strong>{visitedCount}</strong><span>{c.countries}</span></div><em>+2 {c.perMonth}</em></div><div className="stat"><span className="stat-icon coral"><BookOpen size={17} /></span><div><strong>{memoriesCount}</strong><span>{c.memories}</span></div><em>+4 {c.perMonth}</em></div><div className="stat"><span className="stat-icon violet"><Star size={17} /></span><div><strong>4.8</strong><span>{c.avgRating}</span></div><em>{c.outOf} 5.0</em></div><div className="stat rank-stat"><span className="stat-icon gold"><Trophy size={17} /></span><div><strong>#128</strong><span>{c.worldRank}</span></div><em>{c.rankChange}</em></div></div>
}

function MemoryCard({ memory, onOpenCountry }: { memory: Memory; onOpenCountry: (id: string) => void }) {
  const country = getCountry(memory.countryId)
  return <article className="memory-card"><button className="memory-image" onClick={() => onOpenCountry(memory.countryId)} style={{ backgroundImage: `url(${memory.image})` }} aria-label={`Открыть запись: ${memory.title}`}><span className="memory-country">{country?.name}</span><span className="image-arrow"><ArrowUpRight size={15} /></span></button><div className="memory-body"><div className="memory-meta"><span>{memory.date}</span><span className="rating">{'★'.repeat(memory.rating)}<i>{'★'.repeat(5 - memory.rating)}</i></span></div><h3>{memory.title}</h3><p>{memory.excerpt}</p></div></article>
}

function CountriesView({ filteredCountries, visitedSet, regionFilter, onRegion, onToggle, onOpen, searchQuery, onSearch, c }: { filteredCountries: Country[]; visitedSet: Set<string>; regionFilter: Region | 'all'; onRegion: (region: Region | 'all') => void; onToggle: (id: string) => void; onOpen: (id: string) => void; searchQuery: string; onSearch: (value: string) => void; c: Copy }) {
  return <div className="page"><div className="page-heading-row"><div><p className="eyebrow">{c.collection}</p><h1>{c.allCountries}</h1><p className="heading-note">{c.collectionNote}</p></div><div className="collection-progress"><strong>{visitedSet.size}</strong><span>{c.outOf} {COUNTRY_COUNT} {c.marked}</span><div><i style={{ width: `${(visitedSet.size / COUNTRY_COUNT) * 100}%` }} /></div></div></div><div className="country-toolbar"><label className="search-field wide"><Search size={16} /><input value={searchQuery} onChange={(event) => onSearch(event.target.value)} placeholder={c.searchCountries} /><kbd>⌘ K</kbd></label><div className="filter-row"><button className={`filter-button ${regionFilter === 'all' ? 'is-active' : ''}`} onClick={() => onRegion('all')}>{c.allRegions}</button>{regionCounts.map((region) => <button key={region.name} className={`filter-button ${regionFilter === region.name ? 'is-active' : ''}`} onClick={() => onRegion(region.name)}>{region.name} <span>{region.count}</span></button>)}</div><button className="icon-button" title={c.extraFilters}><Filter size={17} /></button></div><div className="country-list">{filteredCountries.slice(0, 80).map((country) => { const visited = visitedSet.has(country.id); return <div className={`country-row ${visited ? 'is-visited' : ''}`} key={country.id}><span className="country-status">{visited ? <Check size={14} /> : <span />}</span><div className="country-name"><strong>{country.name}</strong><span>{country.region}</span></div><div className="country-code">{country.code}</div><button className="row-action" onClick={() => onOpen(country.id)}><ArrowUpRight size={15} /></button><button className={`visit-toggle ${visited ? 'is-visited' : ''}`} onClick={() => onToggle(country.id)}>{visited ? c.visitedButton : c.mark}</button></div> })}</div>{filteredCountries.length > 80 && <p className="list-footnote">{c.shown80}</p>}</div>
}

function JournalView({ memories, onOpenCountry, onAdd, c }: { memories: Memory[]; onOpenCountry: (id: string) => void; onAdd: () => void; c: Copy }) {
  return <div className="page"><div className="page-heading-row"><div><p className="eyebrow">{c.memory}</p><h1>{c.journalTitle}</h1><p className="heading-note">{c.journalNote}</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} />{c.newEntry}</button></div><div className="journal-list">{memories.map((memory) => <div className="journal-row" key={memory.id}><div className="journal-thumb" style={{ backgroundImage: `url(${memory.image})` }} /><div className="journal-content"><div className="memory-meta"><span>{memory.date}</span><span className="rating">{'★'.repeat(memory.rating)}<i>{'★'.repeat(5 - memory.rating)}</i></span></div><h3>{memory.title}</h3><p>{memory.excerpt}</p><span className="journal-place">{getCountry(memory.countryId)?.name}</span></div><button className="row-action" onClick={() => onOpenCountry(memory.countryId)}><ArrowUpRight size={15} /></button></div>)}</div></div>
}

function GoalsView({ visitedCount, progress, visitedSet, onAdd, c }: { visitedCount: number; progress: number; visitedSet: Set<string>; onAdd: () => void; c: Copy }) {
  const goals = [{ title: c === copy.en ? 'First 10 countries' : 'Первые 10 стран', text: c === copy.en ? 'The start of a bigger route' : 'Начало большого маршрута', target: 10, icon: Compass }, { title: c === copy.en ? 'Reach 25%' : 'Покорить 25%', text: c === copy.en ? 'A quarter of the map behind you' : 'Четверть карты за плечами', target: Math.ceil(COUNTRY_COUNT * .25), icon: Globe2 }, { title: c === copy.en ? 'All continents' : 'Все континенты', text: c === copy.en ? 'Leave a mark in every region' : 'Поставить точку в каждом регионе', target: 5, icon: MapPinned }]
  return <div className="page"><div className="page-heading-row"><div><p className="eyebrow">{c.longRoute}</p><h1>{c.goalsTitle}</h1><p className="heading-note">{c.goalsNote}</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} />{c.addCountry}</button></div><div className="goals-summary panel-surface"><div className="summary-number"><strong>{progress}<small>%</small></strong><span>{c.exploredWorld}</span></div><div className="summary-line"><div><span>{c.overall}</span><strong>{visitedCount} / {COUNTRY_COUNT}</strong></div><div className="long-progress"><i style={{ width: `${progress}%` }} /></div></div><div className="summary-note"><Sparkles size={16} /><span>{c.nextLevel}</span></div></div><div className="goals-grid">{goals.map(({ title, text, target, icon: Icon }) => { const reached = target <= (title.includes('continent') || title.includes('континент') ? new Set([...visitedSet].map((id) => getCountry(id)?.region)).size : visitedCount); return <article className={`goal-card ${reached ? 'is-reached' : ''}`} key={title}><span className="goal-icon"><Icon size={20} /></span><div><span className="goal-state">{reached ? c.reached : c.inProgress}</span><h3>{title}</h3><p>{text}</p></div><strong className="goal-target">{reached ? <Check size={19} /> : target}</strong></article> })}</div><div className="milestone-note"><Medal size={18} /><div><strong>{c === copy.en ? 'A new record is close' : 'Новый рекорд рядом'}</strong><p>{c === copy.en ? 'Add one more country to climb 14 places in the ranking.' : 'Добавь ещё одну страну, чтобы подняться на 14 мест в рейтинге.'}</p></div><ArrowUpRight size={18} /></div></div>
}

function CountryDrawer({ country, visited, memories, onClose, onToggle, onAddMemory, c }: { country: Country; visited: boolean; memories: Memory[]; onClose: () => void; onToggle: () => void; onAddMemory: () => void; c: Copy }) {
  return <aside className="country-drawer"><div className="drawer-top"><span className="drawer-kicker">{c.countryCard}</span><button className="icon-button" onClick={onClose} title={c.help}><X size={18} /></button></div><div className="drawer-hero"><div className="drawer-globe"><Globe2 size={42} strokeWidth={1.25} /></div><span className="drawer-region">{country.region}</span><h2>{country.name}</h2><span className="drawer-code">{country.code}</span></div><div className="drawer-status">{visited ? <><span className="status-mark"><Check size={14} /></span><div><strong>{c.youWereHere}</strong><span>{c.markedInAtlas}</span></div></> : <><span className="status-mark empty"><MapPinned size={14} /></span><div><strong>{c.stillAhead}</strong><span>{c.addToRoute}</span></div></>}</div><button className={`drawer-visit ${visited ? 'is-visited' : ''}`} onClick={onToggle}>{visited ? <><Check size={17} />{c.visitedButton}</> : <><Plus size={17} />{c.markVisited}</>}</button><div className="drawer-section-head"><span>{c.impressions}</span><button onClick={onAddMemory}><Plus size={15} />{c.add}</button></div>{memories.length ? memories.map((memory) => <div className="drawer-memory" key={memory.id}><div className="drawer-memory-image" style={{ backgroundImage: `url(${memory.image})` }} /><div><strong>{memory.title}</strong><span>{memory.date}</span></div></div>) : <div className="drawer-empty"><Camera size={19} /><span>{c.emptyMemory}</span></div>}<div className="drawer-footer"><span><Star size={15} />{c.personalRating}</span><strong>{memories.length ? `${memories[0].rating}.0 / 5` : '—'}</strong></div></aside>
}

function MemoryModal({ onClose, onSubmit, c }: { onClose: () => void; onSubmit: (memory: Memory) => void; c: Copy }) {
  const [countryId, setCountryId] = useState('португалия')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [rating, setRating] = useState(5)
  const [image, setImage] = useState('')
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim() || !excerpt.trim()) return; onSubmit({ id: `memory-${Date.now()}`, countryId, title: title.trim(), excerpt: excerpt.trim(), rating, image: image.trim() || 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=82', date: c === copy.en ? 'Aug 14, 2026' : '14 авг 2026', accent: '#69d2c6' }) }
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">{c.newMemory}</span><h2>{c.saveMoment}</h2></div><button className="icon-button" onClick={onClose} title={c.help}><X size={18} /></button></div><form onSubmit={submit}><label>{c.country}<select value={countryId} onChange={(event) => setCountryId(event.target.value)}>{COUNTRIES.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></label><label>{c.title}<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={c === copy.en ? 'For example, Light over Alfama' : 'Например, Свет на Алфаме'} autoFocus /></label><label>{c.memory}<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder={c.memoryPrompt} rows={4} /></label><label>{c.photoUrl} <span className="optional">{c.optional}</span><input value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." /></label><div className="rating-picker"><span>{c.rating}</span><div>{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={value <= rating ? 'is-active' : ''} onClick={() => setRating(value)} aria-label={`${value} / 5`}><Star size={19} fill="currentColor" /></button>)}</div></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>{c.cancel}</button><button type="submit" className="primary-button"><Upload size={16} />{c.save}</button></div></form></div></div>
}

function CountryPickerModal({ visitedSet, onClose, onToggle, c }: { visitedSet: Set<string>; onClose: () => void; onToggle: (id: string) => void; c: Copy }) {
  const [query, setQuery] = useState('')
  const options = COUNTRIES.filter((country) => !visitedSet.has(country.id) && country.name.toLocaleLowerCase('ru-RU').includes(query.toLocaleLowerCase('ru-RU'))).slice(0, 8)
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card compact-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">{c.newMark}</span><h2>{c.whereBeen}</h2></div><button className="icon-button" onClick={onClose} title={c.help}><X size={18} /></button></div><label className="search-field wide"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.findCountry} autoFocus /></label><div className="picker-list">{options.map((country) => <button key={country.id} className="picker-row" onClick={() => onToggle(country.id)}><span className="country-status"><span /></span><span><strong>{country.name}</strong><small>{country.region}</small></span><Plus size={17} /></button>)}{!options.length && <p className="empty-search">{c.countryNotFound}</p>}</div></div></div>
}

export default App
