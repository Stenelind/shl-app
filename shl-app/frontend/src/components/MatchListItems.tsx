import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/matchListItemStyles';  

interface Match {
  matchid: string;
  lag1: string;
  lag1Abbreviation: string;
  lag2: string;
  lag2Abbreviation: string;
  poangLag1: number;
  poangLag2: number;
}

// 🔵 Props för komponenten
interface MatchListItemProps {
  match: Match;
}

const getLogo = (team: string) => {
  switch (team) {
    case 'Färjestad BK':
      return require('../../assets/fbk.png');         
    case 'Skellefteå AIK':
      return require('../../assets/skelleftea.png');
    case 'Timrå IK':
      return require('../../assets/tik.png');         
    case 'Växjö Lakers':
      return require('../../assets/vlh.png');
    case 'Luleå HF':
      return require('../../assets/lhf.png');         
    case 'Frölunda HC':
      return require('../../assets/fhc.png');
    case 'Malmö Redhawks':
      return require('../../assets/mif.png');         
    case 'Örebro Hockey':
      return require('../../assets/ohk.png'); 
      case 'HV71':
      return require('../../assets/hv71.png');         
    case 'MoDo Hockey':
      return require('../../assets/modo.png'); 
      case 'Leksands IF':
      return require('../../assets/lif.png');         
    case 'Brynäs IF':
      return require('../../assets/bif.png'); 
      case 'Rögle BK':
      return require('../../assets/rbk.png');         
    case 'Linköping HC':
      return require('../../assets/lhc.png');  
  }
};

// ✅ Här definieras själva React-komponenten
const MatchListItem: React.FC<MatchListItemProps> = ({ match }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* 🟢 Lag 1 */}
        <View style={styles.teamContainer}>
          <Image
            source={getLogo(match.lag1)}
            style={styles.logo}
          />
          <Text style={styles.teamName}>{match.lag1}</Text>
        </View>

        {/* 🔵 Resultat i mitten */}
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{match.poangLag1}</Text>
          <Text style={styles.separator}> - </Text>
          <Text style={styles.score}>{match.poangLag2}</Text>
        </View>

        {/* 🔴 Lag 2 */}
        <View style={styles.teamContainer}>
          <Image
            source={getLogo(match.lag2)}
            style={styles.logo}
          />
          <Text style={styles.teamName}>{match.lag2}</Text>
        </View>
      </View>
    </View>
  );
};

export default MatchListItem;
