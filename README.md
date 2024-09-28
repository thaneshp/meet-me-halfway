# Meet Me Halfway

A web-app designed to find cafes and restaurants at the mid-point of two given locations.

## Installation and Setup

### Prerequisites

-   Python 3.10 or higher
-   Google Maps API Key

### Installation

1. Create a virtual environment

    ```shell
    python3 -m venv .venv
    ```

2. Activating `.venv`

    ```shell
    source .venv/bin/activate
    ```

3. Install dependencies

    ```shell
    pip install -r requirements.txt
    ```

4. Create a `.env` file in the root directory and set the `GOOGLE_MAPS_API_KEY` environment variable.

    ```shell
    GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
    ```

5. Running the app

    ```shell
    python3 manage.py runserver
    ```

## Usage

1. Click on the `+ ADD ADDRESS` button
2. Enter two addresses into the input fields
3. The map will automatically populate with recommended cafes and restaurants

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Thanesh Pannirselvam - [@thaneshp333](https://x.com/thaneshp333)
