export default function wallboxStateToAnzeige({atHome, wallboxState}) {
  switch(wallboxState) {
    case 'Lädt':
      return 'Lädt';

    case 'Nicht verbunden':
      if(atHome) {
        return 'Getrennt';
      }

      return 'Unterwegs';

    case 'Warte auf Ladefreigabe':
      return 'Bereit';

    default:
      return wallboxState;
  }
}
