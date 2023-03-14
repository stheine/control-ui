const translateCode = function(code) {
  switch(code) {
    case 0:
    case 1:
      return 'Wolkenlos';
    case 2:
      return 'Heiter';
    case 3:
      return 'Bewölkt';
    case 4:
      return 'Bedeckt';
    case 5:
    case 45:
      return 'Nebel';
    case 6:
    case 48:
      return 'gefrierender Nebel';
    case 7:
    case 61:
      return 'leichter Regen';
    case 8:
    case 63:
      return 'Regen';
    case 9:
    case 65:
      return 'kräftiger Regen';
    case 10:
      return 'gefrierender Regen';
    case 11:
      return 'kräftiger gefrierender Regen';
    case 12:
    case 66:
      return 'Schneeregen';
    case 13:
    case 67:
      return 'kräftiger Schneeregen';
    case 14:
    case 71:
      return 'leichter Schneefall';
    case 15:
    case 73:
      return 'Schneefall';
    case 16:
    case 75:
      return 'kräftiger Schneefall';
    case 17:
    case 77:
      return 'Eiskörner';
    case 18:
    case 51:
    case 53:
    case 80:
    case 81:
      return 'Regenschauer';
    case 19:
    case 55:
    case 82:
      return 'kräftiger Regenschauer';
    case 20:
      return 'Schneeregenschauer';
    case 21:
      return 'kräftiger Schneeregenschauer';
    case 22:
      return 'Schneeschauer';
    case 23:
      return 'kräftiger Schneeschauer';
    case 24:
      return 'Graupelschauer';
    case 25:
      return 'kräftiger Graupelschauer';
    case 26:
      return 'Gewitter ohne Niederschlag';
    case 27:
    case 95:
      return 'Gewitter';
    case 28:
      return 'kräftiges Gewitter';
    case 29:
    case 96:
      return 'Gewitter mit Hagel';
    case 99:
    case 30:
      return 'kräftiges Gewitter mit Hagel';
    case 31:
      return 'Sturm mit Böen';

    default:
      // eslint-disable-next-line no-console
      console.log('translateCode, unhandled', {code});

      return code;
  }
};

export default translateCode;
