/** Template (w odróżnieniu od layoutu) montuje się przy każdej nawigacji – daje łagodne wejście treści strony */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>
}
