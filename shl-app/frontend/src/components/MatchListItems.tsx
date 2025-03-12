import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
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

// 🟢 Funktion för att hämta logotyper
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
    default:
      return null;
  }
};

interface MatchListItemProps {
  match: Match;
}

const MatchListItem = ({ match }: MatchListItemProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <View style={styles.teamContainer}>
            <Image
              source={getLogo(match.lag1)}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{match.lag1}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{match.poangLag1}</Text>
            <Text style={styles.separator}> - </Text>
            <Text style={styles.score}>{match.poangLag2}</Text>
          </View>

          <View style={styles.teamContainer}>
            <Image
              source={getLogo(match.lag2)}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{match.lag2}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>Matchdetaljer</Text>
            <View style={styles.row}>
              <View style={styles.teamContainer}>
                <Image
                  source={getLogo(match.lag1)}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.teamName}>{match.lag1}</Text>
              </View>

              <View style={styles.scoreContainer}>
                <Text style={styles.score}>{match.poangLag1}</Text>
                <Text style={styles.separator}> - </Text>
                <Text style={styles.score}>{match.poangLag2}</Text>
              </View>

              <View style={styles.teamContainer}>
                <Image
                  source={getLogo(match.lag2)}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.teamName}>{match.lag2}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Stäng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MatchListItem;
