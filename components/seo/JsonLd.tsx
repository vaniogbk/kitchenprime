/**
 * Injecte un bloc JSON-LD (données structurées Schema.org).
 *
 * `<` est échappé pour qu'une chaîne contenant `</script>` ne puisse pas
 * fermer la balise prématurément — c'est la protection XSS standard pour du
 * JSON injecté dans un script inline.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
