import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setDescription] = useState('');

  const saveTask = async () => {
    if (!taskName || !taskDescription) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      
      const existingTasks = await AsyncStorage.getItem('tasks');
      let tasksArray = existingTasks ? JSON.parse(existingTasks) : [];

      
      const newTask = { id: Date.now().toString(), taskName, taskDescription };
      tasksArray.push(newTask);

      
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));

      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully! 📚',
          body: `Don't forget to complete your ${taskName}.`,
        },
        trigger: null,
      });

      
      router.back();
    } catch (error) {
      console.error('Failed to save task', error);
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
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg',
          }}
          style={styles.bannerImage}
        />

        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={styles.input}
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Enter task name"
        />

        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={taskDescription}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline={true}
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={saveTask}>
          <Text style={styles.buttonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.85)' },
  bannerImage: { width: '100%', height: 150, borderRadius: 10, marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});