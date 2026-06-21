Optimaliseer alle write operaties.

Momenteel wordt alles onmiddellijk naar de database geschreven.

Maak:
- Write queue
- Background workers
- Bulk updates
- Retry systeem
- Dead letter queue

Doel:
minimaal aantal database writes zonder dat data verloren gaat.