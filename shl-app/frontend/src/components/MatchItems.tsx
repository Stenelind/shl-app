import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { Match } from "../types/match";
import styles from '../styles/matchStyles';

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
                <Text style={styles.teamName}>{match.lag1Abbreviation}</Text>
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
                <Text style={styles.teamName}>{match.lag2Abbreviation}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerTime}>12:20</Text>
              <Text style={styles.footerSkott}>5 Skott 3</Text>
              <Text style={styles.footerPeriod}>Period 1</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statsColumn}>
                <Text style={styles.statTitle}>Skott på mål</Text>
                <Text style={styles.statValue}>5</Text>

                <Text style={styles.statTitle}>Gjorda mål i numerära överlägen</Text>
                <Text style={styles.statValue}>1</Text>

                <Text style={styles.statTitle}>Vunna tekningar</Text>
                <Text style={styles.statValue}>8</Text>

                <Text style={styles.statTitle}>Utvisningar i minuter</Text>
                <Text style={styles.statValue}>4</Text>

                <Text style={styles.statTitle}>Räddningar (%)</Text>
                <Text style={styles.statValue}>85.19</Text>
              </View>

              <View style={styles.statsColumn}>
                <Text style={styles.statTitle}>Skott på mål</Text>
                <Text style={styles.statValue}>3</Text>

                <Text style={styles.statTitle}>Gjorda mål i numerära överlägen</Text>
                <Text style={styles.statValue}>0</Text>

                <Text style={styles.statTitle}>Vunna tekningar</Text>
                <Text style={styles.statValue}>6</Text>

                <Text style={styles.statTitle}>Utvisningar i minuter</Text>
                <Text style={styles.statValue}>0</Text>

                <Text style={styles.statTitle}>Räddningar (%)</Text>
                <Text style={styles.statValue}>92.50</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MatchListItem;
