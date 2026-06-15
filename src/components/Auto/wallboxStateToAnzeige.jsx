export default function wallboxStateToAnzeige({atHome, carStatus, wallboxState}) {
  switch(wallboxState) {
    case 'Lädt':
      return 'Lädt';

    case 'Nicht verbunden':
      if(atHome) {
        return 'Getrennt';
      }

      if(carStatus === 'parked') {
        return <>Parkt&nbsp;&nbsp;</>;
      }

      return 'Unterwegs';

    case 'Warte auf Ladefreigabe':
      return 'Bereit';

    default:
      return wallboxState;
  }
}
