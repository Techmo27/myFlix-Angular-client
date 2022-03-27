import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditProfileFormComponent } from '../edit-profile-form/edit-profile-form.component';
import { UserRegistrationService } from '../fetch-api-data.service';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

interface Movies {
  Title: string;
  _id: string;
  ImagePath: string;
  Genre: Genre[];
  Director: Director[]
}

interface Genre {
  Description: string;
  Name: string;
}

interface Director {
  Birth: string;
  Name: string;
  Bio: string;
}

interface User {
  Username: string;
  Password: string;
  Email: string;
  Birthday: string;
  FavouriteMovies: string[]
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: undefined | User = undefined
  favorites: any[] = [];
  movies: Movies[] = []

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Getting user data & favorites by calling api endpoint
   */
  getUser(): void {
    this.fetchApiData.getUserProfile().subscribe((result: any) => {
      this.user = result;
      this.favorites = this.getFavorites(this.movies, result.FavoriteMovies);
      return (this.user, this.favorites);
    });
  }

  /**
   * Getting users favorites
   * @param movies 
   * @param userFavoriteMovies 
   * @returns array of favorites
   */
  getFavorites(movies: Movies[], userFavoriteMovies: string[]) {
    if (movies.length === 0 || userFavoriteMovies.length === 0) {
      return []
    }

    return movies.filter(movie => userFavoriteMovies.findIndex(m => m === movie._id) !== -1)
  }
  /**
   * Calling movies api endpoint
   * @returns array of movies
   */
  getMovies() {
    this.fetchApiData.getAllMovies().subscribe((resp: Movies[]) => {
      this.movies = resp
      this.getUser();
      return this.movies
    });
  }

  /**
   * Opening edit profile dialog
   * @returns edit profile form
   */
  openEditProfile(): void {
    this.dialog.open(EditProfileFormComponent, {
      width: '450px'
    });
  }

  /**
   * Calling delete profile api endpoint
   * @returns delete notice
   */
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

  /**
   * Calling delete movies api endpoint
   * @param movieID 
   * @param title 
   */
  deleteFavorites(movieID: string, title: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieID).subscribe((result: any) => {
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

  /**
   * Opening genre dialog
   * @param name 
   * @param description 
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        name: name,
        description: description,
      },
      width: '450px'
    });
  }

  /**
   * Opening director dialog
   * @param name 
   * @param bio 
   * @param birth 
   */
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

  /**
   * Opening movie description dialog
   * @param title 
   * @param description 
   */
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
