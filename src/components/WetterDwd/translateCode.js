const translateCode = function(code) {
  switch(code) {
    case 1:
      return 'Wolkenlos';
    case 2:
      return 'Heiter';
    case 3:
      return 'Bewölkt';
    case 4:
      return 'Bedeckt';
    case 5:
      return 'Nebel';
    case 6:
      return 'Nebel'; // gefrierender Nebel
    case 7:
      return 'Regen'; // leichter Regen
    case 8:
      return 'Regen';
    case 9:
      return 'Regen'; // kraeftiger Regen
    case 10:
      return 'Schneeregen'; // gefrierender Regen
    case 11:
      return 'Schneeregen'; // kraeftiger gefrierender Regen
    case 12:
      return 'Schneeregen';
    case 13:
      return 'Schneeregen'; // kraeftiger Schneeregen
    case 14:
      return 'Schneefall'; // leichter Schneefall
    case 15:
      return 'Schneefall';
    case 16:
      return 'Schneefall'; // kraeftiger Schneefall
    case 17:
      return 'Schneefall'; // Eiskoerner
    case 18:
      return 'Regenschauer';
    case 19:
      return 'Regenschauer'; // kraeftiger Regenschauer
    case 20:
      return 'Schneeregenschauer';
    case 21:
      return 'Schneeschauer'; // kraeftiger Schneeregenschauer
    case 22:
      return 'Schneeschauer';
    case 23:
      return 'Schneeschauer'; // kraeftiger Schneeschauer
    case 24:
      return 'Schneeschauer'; // Graupelschauer
    case 25:
      return 'Schneeschauer'; // kraeftiger Graupelschauer
    case 26:
      return 'Gewitter'; // Gewitter ohne Niederschlag
    case 27:
      return 'Gewitter';
    case 28:
      return 'Gewitter'; // kraeftiges Gewitter
    case 29:
      return 'Gewitter'; // Gewitter mit Hagel
    case 30:
      return 'Gewitter'; // kraeftiges Gewitter mit Hagel
    case 31:
      return 'Sturm'; // Boen

// 0           Clear sky
// 1, 2, 3     Mainly clear, partly cloudy, and overcast
// 45, 48      Fog and depositing rime fog
// 51, 53, 55  Drizzle: Light, moderate, and dense intensity
// 56, 57      Freezing Drizzle: Light and dense intensity
// 61, 63, 65  Rain: Slight, moderate and heavy intensity
// 66, 67      Freezing Rain: Light and heavy intensity
// 71, 73, 75  Snow fall: Slight, moderate, and heavy intensity
// 77          Snow grains
// 80, 81, 82  Rain showers: Slight, moderate, and violent
// 85, 86      Snow showers slight and heavy
// 95 *        Thunderstorm: Slight or moderate
// 96, 99 *    Thunderstorm with slight and heavy hail
    default:
      // eslint-disable-next-line no-console
      console.log('translateCode, unhandled', {code});

      return code;
  }
};

export default translateCode;
