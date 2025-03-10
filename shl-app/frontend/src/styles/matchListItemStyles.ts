// src/styles/matchListItemStyles.ts
import { StyleSheet, Dimensions } from "react-native";
import colors from './colors'; 

const { height } = Dimensions.get("window");
 

const matchListItemStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,  
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,                   
    shadowColor: '#000',               
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,                      
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,                         
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
    color: colors.textDark,  
    fontWeight: 'bold',
    textAlign: 'center',               
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,  
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textLight,  
  },
  separator: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textLight,
    marginHorizontal: 4,
  },
  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.textLight,
  },
  subTitle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  listItem: {
    minHeight: height * 0.1,
    justifyContent: "center",
  },
  loadingText: {
    color: colors.textLight,  
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
   // Overlay-styling
   overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  },
  overlayCard: {
    width: '80%',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.textDark,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  closeButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default matchListItemStyles;