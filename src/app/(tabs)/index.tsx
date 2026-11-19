import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState([]);

  // Screen එක focus වෙන සෑම අවස්ථාවකදීම Data re-load වීම[cite: 6]
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Your Tasks</Text>

        <ScrollView style={styles.list}>
          {tasks.length === 0 ? (
            <Text style={styles.empty}>No tasks saved yet. Add one!</Text>
          ) : (
            tasks.map((task: any) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{task.taskName}</Text>
                <Text style={styles.taskDescription}>{task.taskDescription}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-task')}>
          <Text style={styles.addButtonText}>+ Add New Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.85)' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  list: { flex: 1 },
  empty: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#666' },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: 'blue',
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: 'blue' },
  taskDescription: { fontSize: 14, color: '#333', marginTop: 4 },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});