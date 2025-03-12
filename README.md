# TodoPub: Todoist Public Projects

A simple tool to create public links to view Todoist projects. The user first generates a token containing their Todoist API and Project ID, and then can share a link containing that token to others. Tokens are encrypted using a secret stored on the server, but no data is persisted on the server.

Make sure to set the `SECRET` environment variable to some password when deploying this yourself. This is what the encryption key is derived from. Including `$` or `#` can mess things up, so don't include those characters in your password without escaping them. I ended up just generating a 128 character password through my password manager to use for this.
