# TranslationClient Library

The TranslationClient library provides an easy-to-use interface for polling the status of translation jobs from a server endpoint. It manages the polling logic internally, ensuring timely updates without overloading the server or causing unnecessary delays.

## Features

- **Automated Polling**: Internally handles polling with customizable intervals.
- **Dynamic Polling Strategy**: Consistent polling during pending status to reduce delays.
- **Customizable Options**: Allows adjustment of timeouts and intervals.
- **Event Callbacks**: Supports callbacks for completed, pending, and error events.
- **Subscription Support**: Offers RxJS Subject for subscribing to status updates.
- **Cancellation Support**: Ability to cancel polling when needed.

## Design Overview
### Dependencies
- `axios`: Used for HTTP requests to the translation server.
- `rxjs/Subject`: Provides a reactive stream to subscribe to status updates.

### Design Logic

1. **Status Subject**: The `statusSubject` (from RxJS) creates an observable stream, allowing subscribers to receive real-time updates on the translation status.
  
2. **Polling Logic**:
   - Polling is initiated with `pollStatus()`.
   - To prevent multiple concurrent polling processes, `isPolling` is checked. If polling is in progress, it warns and exits.
   - The client polls the server by sending a GET request to `serverUrl`. The response status (`completed`, `error`, `pending`, or unknown) dictates which callback is executed.
   
3. **Status Handling**:
   - **Completed**: If the server returns `result: "completed"`, the `onCompleted` callback is executed, `statusSubject` completes, and polling stops.
   - **Error**: If the result is `error`, the `onError` callback is invoked with an error message, and polling stops.
   - **Pending**: If the translation is still in progress, the `onPending` callback provides feedback to the user.
   - **Unknown Status**: Any unexpected status triggers a warning, logging the unknown result for further debugging.

4. **Exponential Backoff with Jitter**:
   - The polling interval increases exponentially, doubling each cycle, but is capped by `maxInterval`.
   - To prevent “thundering herd” issues, a random jitter is applied, modifying the interval slightly. This improves reliability, especially in distributed systems.

5. **Timeout**:
   - If the polling exceeds the defined `timeout` duration, it stops, invokes `onError` with a timeout error, and notifies `statusSubject`.

6. **Cancellation**:
   - `cancel()` allows the polling process to stop prematurely, which completes the `statusSubject` stream.

7. **Subscriptions**:
   - The `subscribe()` method allows external components to subscribe to the `statusSubject`, enabling them to react to changes in real-time.

## Installation

### 1. Clone the Git Repo
~~~sh
git clone git@github.com:kxc663/Translation-Client.git
~~~

### 2. Install necessary packages
~~~sh
npm install
~~~

## How to Use

### 1. Import TranslationClient.js
```js
import TranslationClient from 'translation-client';
```

### 2. Creating an Instance
```js
const client = new TranslationClient('https://api.example.com/status', {
    timeout: 30000,      // Optional: Maximum time to keep polling (in milliseconds)
    pollInterval: 1000,  // Optional: Polling interval when status is 'pending' (in milliseconds)
    onCompleted: () => {
        console.log('Translation has been completed successfully.');
    },
    onError: (error) => {
        console.error('An error occurred:', error.message);
    },
    onPending: () => {
        console.log('Translation is still in progress...');
    },
});
```

### 3. Starting Polling
```js
client.pollStatus();
```

### 4. Subscribing to Status Updates
```js
const subscription = client.subscribe(
    (status) => {
        console.log('Status update:', status);
    },
    (error) => {
        console.error('Subscription error:', error.message);
    },
    () => {
        console.log('Polling has completed.');
    }
);
```

## Examples
Please check `test.js` for working examples