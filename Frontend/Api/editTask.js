export const editTask = async (task) => {
  console.log('Editing task:', task);

  try {
    const response = await fetch('https://issuetracker-igbb7eeot-adarsh-pandeys-projects-b829a453.vercel.app/?vercelToolbarCode=8TqFpDxewpNMSR3/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Task updated successfully:', data);
      return data; // Returning the response data so you can use it in the frontend
    } else {
      throw new Error(data.message || 'Failed to update task');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error; // Propagate error so that it can be handled in the calling function
  }
};
