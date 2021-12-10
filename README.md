# Storo
[![Website](https://img.shields.io/website?style=for-the-badge&up_message=live%20demo&url=https%3A%2F%2Fstoro-riddhesh.herokuapp.com%2F%23)](https://storo-riddhesh.herokuapp.com/#) &nbsp; ![GitHub repo size](https://img.shields.io/github/repo-size/riddhesh-mahajan/storo?style=for-the-badge) 


Store on files and folders from any mobile device, tablet, or computer

&emsp;
# Prerequisites

The setups steps expect following tools installed on the system.

- Github
- Ruby [6.1.4.1](https://www.ruby-lang.org/en/downloads/)
- Rails [ruby 2.6.9p207](https://rubyonrails.org/)
  

&emsp;
# Setup

##### 1. Check out the repository

```bash
git clone git@github.com:organization/project-name.git
```

##### 2. Install required gems

```bash
bundle install
```

##### 3. Create and setup the database

Run the following commands to install react for rails.

```bash
bundle exec rails webpacker:install:react
```

##### 4. Create and setup the database

Run the following commands to create and setup the database.

```bash
rails db:create
rails db:setup
```

##### 5. Create .env file
##### Create -env file in project's root folder
```bash
JWT_SECRET='eyJhbGciOiJIUzI1NiJ9'
S3_BUCKET='your_bucket_name'
REGION='your_bucket_region'
ACCESS_KEY='aws_access_key'
SECRET_ACCESS_KEY='aws_secret_access_key'
```

##### 6. Start the Rails server

You can start the rails server using the command given below.

```bash
rails s
```

##### 7. Open URL in web browser

[http://127.0.0.1:3000/#](http://127.0.0.1:3000/#)


&emsp;
# Technologies Used

| Name        | Description |
| ----------- | ---------------- |
| Ruby on Rails     | Ruby on Rails is a model–view–controller framework, providing default structures for a database, a web service, and web pages. |
| React | React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. |
| Bootstrap  | Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development.  |
AWS | Amazon Web Services, Inc. is a subsidiary of Amazon providing on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered pay-as-you-go basis.