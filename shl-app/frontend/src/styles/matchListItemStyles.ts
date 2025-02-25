import { StyleSheet } from 'react-native';

const matchListItemStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',           
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
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',               
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181d26',        
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',                     
  },
  separator: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#0B192C',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  }
});

export default matchListItemStyles;
