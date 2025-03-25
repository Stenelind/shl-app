import { StyleSheet, Dimensions } from "react-native";
import colors from './colors'; 

const { height } = Dimensions.get("window");
 

const matchItem = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,  
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 4,                   
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
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  score: {
    fontSize: 24,
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
   overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  },
  overlayCard: {
    width: '90%',
    backgroundColor: colors.backgroundCard,
    borderRadius: 4,
    paddingTop: 20,
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
    position: 'absolute',
    top: 0,
    right: 8,
    padding: 6,  
    zIndex: 999,   
  },
  closeButtonText: {
    color: colors.background,  
    fontWeight: 'bold',
    fontSize: 40,      
    textAlign: 'center',  
  },
  footerContainer: {
    width: '100%',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: colors.background, 
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
  },
  footerTime: {
    fontSize: 18,
    color: colors.textLight,  
    fontWeight: 'bold',
    backgroundColor: '#e33125', 
    padding: 5, 
    borderRadius: 4,
    marginLeft: 8,  
  },
  footerSkott: {
    fontSize: 18,
    color: colors.textLight,  
    fontWeight: 'bold',
    marginLeft: 16,
  },
  footerPeriod: {
    fontSize: 18,
    color: colors.textLight,  
    fontWeight: 'bold',
    marginRight: 10,
  }, 
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15, 
  },
  
  statsColumn: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  
  statTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 5,
    textAlign: "center",
  },
  
  statValue: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 10,
    textAlign: "center",
  },
  
});

export default matchItem;