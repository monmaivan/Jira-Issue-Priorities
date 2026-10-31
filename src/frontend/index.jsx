import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);
  return (
    <>
       <Text>PRIORITY: HIGH</Text>
      <Text>- Notify the on-call engineer immediately.</Text>
      <Text>- Escalate in the #support-priority Slack channel.</Text>
      <Text>- Update the customer within 1 hour.</Text>

      <Text>PRIORITY: MEDIUM</Text>
      <Text>- Assign the issue to a senior engineer.</Text>
      <Text>- Provide an initial response within 2 hours.</Text>

      <Text>PRIORITY: LOW</Text>
      <Text>- Add relevant logs or screenshots.</Text>
      <Text>- Update status within 1 business day.</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
