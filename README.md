This is just a test project to demonstrate application built with Java on back-end and JavaScript on front-end.
Project uses [Maven](https://maven.apache.org/) to build the whole application. 


## Build prerequisites
### 1. JDK
- Download and install [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html). 
- Add "JDK/bin" folder to your PATH environment variable.
- Add JAVA_HOME environment variable and set it to "JDK" folder.
### 2. Maven
- Download Maven [here](http://maven.apache.org/download.cgi). Only the binaries are required, so look for the link to apache-maven-{version}-bin.zip or apache-maven-{version}-bin.tar.gz.
- Unzip it to your computer. Then add the bin folder to your PATH environment variable.
- To test the Maven installation, run mvn from the command-line:
    ```
    mvn -v
    ```

## Run the application:
You can run the application using ```mvn spring-boot:run```
Or you can build the JAR file with ```mvn clean package``` and run the JAR by typing:
```
java -jar target/jwjs-test-0.1.0.jar
```