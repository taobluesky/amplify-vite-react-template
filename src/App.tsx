
// import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import { useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(window.location.search);
  // return new URLSearchParams(useLocation().search);
};

function App() {
  const lambdaAuthToken = useQuery().get('token');//'test-token123';//getAuthToken();

  console.log(`token: ${lambdaAuthToken}`);

  const client = generateClient<Schema>({
    authMode: 'lambda',
    authToken: lambdaAuthToken || '',
  });

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create(
      { content: window.prompt("Todo content") }, 
      // { 
      //   authMode: 'lambda',
      //   authToken: lambdaAuthToken,
      // }
    );
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
    <h1>My todos</h1>
    <button onClick={createTodo}>+ new</button>
    <ul>
      {todos.map((todo) => (
        <li
        onClick={() => deleteTodo(todo.id)}
        key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    <div>
      🥳 App successfully hosted. Try creating a new todo.
      <br />
      <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
        Review next step of this tutorial.
      </a>
    </div>
    </main>
  );
}

export default App;
