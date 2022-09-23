import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user!: User | null;
  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged((user) => (this.user = user));
  }

  getMyUser(): User | null {
    return this.auth.currentUser;
  }

  usuarioLogueado(): User {
    if (this.user !== null) {
      return this.user;
    }

    alert('Debes estar logueado');
    this.router.navigate(['/']);
    return {} as User;
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider()); //(signInWithEmailLink)
  }
  logout() {
    return signOut(this.auth);
  }
}
