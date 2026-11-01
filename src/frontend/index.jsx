import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  Text,
  useProductContext,
} from '@forge/react';
import { requestJira } from '@forge/bridge';

// Orientações que serão exibidas para cada grupo de prioridade.
const guidelines = {
  high: [
    'Notify the on-call engineer immediately.',
    'Escalate in the #support-priority Slack channel.',
    'Update the customer within 1 hour.',
  ],
  medium: [
    'Assign the issue to a senior engineer.',
    'Provide an initial response within 2 hours.',
  ],
  low: [
    'Add relevant logs or screenshots.',
    'Update status within 1 business day.',
  ],
};

// Reconhece nomes comuns em inglês e português.
// Prioridades personalizadas precisam ser adicionadas aqui.
const priorityGroups = {
  highest: 'high',
  high: 'high',
  'mais alta': 'high',
  alta: 'high',
  medium: 'medium',
  média: 'medium',
  media: 'medium',
  low: 'low',
  lowest: 'low',
  baixa: 'low',
  'mais baixa': 'low',
};

const App = () => {
  // O contexto informa qual tarefa está aberta no Jira.
  const context = useProductContext();
  const issueKey = context?.extension?.issue?.key;

  const [priority, setPriority] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!issueKey) return;

    // Evita atualizar o painel com uma resposta de uma tarefa anterior.
    let active = true;

    const loadPriority = async () => {
      setLoading(true);
      setError('');
      setPriority(null);

      try {
        // Consulta somente o campo prioridade, com o acesso do usuário.
        const response = await requestJira(
          `/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=priority`
        );

        if (!response.ok) {
          throw new Error(
            `Não foi possível consultar a prioridade (HTTP ${response.status}).`
          );
        }

        const issue = await response.json();

        if (active) {
          setPriority(issue.fields?.priority ?? null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Ocorreu um erro ao consultar o Jira.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPriority();

    return () => {
      active = false;
    };
  }, [issueKey]);

  if (!context) {
    return <Text>Carregando contexto da tarefa...</Text>;
  }

  if (!issueKey) {
    return <Text>Abra este painel dentro de uma tarefa do Jira.</Text>;
  }

  if (loading) {
    return <Text>Consultando a prioridade...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!priority) {
    return <Text>Esta tarefa não possui uma prioridade definida.</Text>;
  }

  const group = priorityGroups[priority.name.trim().toLowerCase()];
  const instructions = guidelines[group];

  return (
    <>
      <Text>Prioridade: {priority.name}</Text>
      {instructions ? (
        instructions.map((instruction) => (
          <Text key={instruction}>- {instruction}</Text>
        ))
      ) : (
        <Text>Ainda não há orientações para esta prioridade.</Text>
      )}
    </>
  );
};

ForgeReconciler.render(<App />);