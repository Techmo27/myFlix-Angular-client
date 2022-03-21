import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditProfileFormComponent } from '../edit-profile-form/edit-profile-form.component';
import { UserRegistrationService } from '../fetch-api-data.service';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = localStorage.getItem('user');
  favorites: any[] = [];

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getUserProfile().subscribe((result: any) => {
      this.user = result;
      this.favorites = result.Favorites;
      console.log(this.user)
      return (this.user, this.favorites);
    });
  }

  openEditProfile(): void {
    this.dialog.open(EditProfileFormComponent, {
      width: '450px'
    });
  }

  deleteProfile(): void {
    this.fetchApiData.deleteUserProfile().subscribe(() => {
      this.snackBar.open('Your profile was deleted', 'OK', {
        duration: 2000,
      });
      localStorage.clear();
    });
    this.router.navigate(['/welcome']).then(() => {
      window.location.reload();
    });
  }

  deleteFavorites(movieID: string, title: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieID).subscribe((result: any) => {
      console.log(result);
      this.snackBar.open(
        'Movie successfully deleted.',
        'OK',
        {
          duration: 2000,
        }
      );
      this.ngOnInit();
    });
  }

  openGenre(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        name: name,
        description: description,
      },
      width: '450px'
    });
  }

  openDirector(name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        name: name,
        bio: bio,
        birth: birth
      },
      width: '450px'
    });
  }

  openSynopsis(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        title: title,
        description: description
      },
      width: '450px'
    });
  }

}
