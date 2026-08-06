import { ContentPage } from "@/components/shared/ContentPage";

const SIZE_TABLE = [
  { eu: 36, us: 5, uk: 3.5 },
  { eu: 37, us: 5.5, uk: 4 },
  { eu: 38, us: 6.5, uk: 5 },
  { eu: 39, us: 7, uk: 5.5 },
  { eu: 40, us: 7.5, uk: 6 },
  { eu: 41, us: 8.5, uk: 7 },
  { eu: 42, us: 9, uk: 7.5 },
  { eu: 43, us: 9.5, uk: 8.5 },
  { eu: 44, us: 10.5, uk: 9.5 },
  { eu: 45, us: 11, uk: 10 },
  { eu: 46, us: 12, uk: 11 },
];

export default function GuidePointuresPage() {
  return (
    <ContentPage
      title="Guide des pointures"
      subtitle="Trouvez votre taille exacte avant de commander."
    >
      <p>
        Nos pointures sont exprimées en EU par défaut. Utilisez le tableau
        ci-dessous pour convertir vers les tailles US ou UK si vous avez
        l'habitude d'une autre référence.
      </p>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 text-xs text-text-muted dark:border-slate-800">
            <th className="py-2">EU</th>
            <th className="py-2">US</th>
            <th className="py-2">UK</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_TABLE.map((row) => (
            <tr key={row.eu} className="border-b border-slate-100 text-text dark:border-slate-800">
              <td className="py-2">{row.eu}</td>
              <td className="py-2">{row.us}</td>
              <td className="py-2">{row.uk}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Comment bien mesurer votre pied</h2>
      <p>
        Mesurez votre pied en fin de journée, debout, sur une feuille de
        papier. Tracez le contour, mesurez la longueur du talon jusqu'à
        l'orteil le plus long, puis comparez au tableau ci-dessus.
      </p>

      <h2>En cas de doute entre deux tailles</h2>
      <p>
        Pour les modèles running, privilégiez la taille au-dessus. Pour les
        modèles ville et streetwear, restez sur votre pointure habituelle.
      </p>
    </ContentPage>
  );
}
