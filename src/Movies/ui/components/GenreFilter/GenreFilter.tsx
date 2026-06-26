import type { Genre } from '../../../../Common'

type GenreFilterProps = {
  genres: Genre[]
  activeGenreId: number | null
  onSelect: (id: number | null) => void
}

export function GenreFilter({ genres, activeGenreId, onSelect }: GenreFilterProps) {
  return (
    <div className="genre-filter">
      <button
        type="button"
        className={`genre-chip ${activeGenreId === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          className={`genre-chip ${activeGenreId === genre.id ? 'active' : ''}`}
          onClick={() => onSelect(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}