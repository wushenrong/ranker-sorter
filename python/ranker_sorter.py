import json
import math
import pathlib

import dearpygui.dearpygui as dpg

from elo_system.elo_system import EloSystem


class Container:
    def __init__(self, obj) -> None:
        self.name = obj["name"]
        self.players = obj["players"]
        self.index_i = 0
        self.index_j = 1
        self.elo = EloSystem()

        for player in self.players:
            self.elo.add_player(player)


def save_file(sender, app_data, user_data):
    name, data = user_data
    file_path = pathlib.Path(app_data["file_path_name"])

    with file_path.open(mode="w", encoding="utf-8") as f:
        f.write(json.dumps({"name": name, "players": data}, indent=4))


def open_file(sender, app_data, user_data):
    file_path = pathlib.Path(app_data["file_path_name"])

    with file_path.open(mode="r", encoding="utf-8") as f:
        if file_path.with_suffix(".json"):
            data = json.loads(f.read())

    create_ranker(Container(data))


def file_dialog(sender, app_data, user_data):
    callback, data = user_data

    dpg.delete_item("new")

    with dpg.file_dialog(
        directory_selector=False, callback=callback, user_data=data
    ):
        dpg.add_file_extension(
            "JavaScript Object Notation (*.json){.json}",
        )


def display_results(data: Container):
    NEW_WINDOW_WIDTH = 600
    NEW_WINDOW_HEIGHT = 480
    SPACING = 0.75

    results = data.elo.get_overall_list()
    x_axis = tuple(
        (player, i * SPACING) for i, player in enumerate(data.players)
    )

    dpg.set_item_width(data.name, NEW_WINDOW_WIDTH)
    dpg.set_item_height(data.name, NEW_WINDOW_HEIGHT)
    dpg.set_item_pos(data.name, [50, 50])

    with dpg.plot(
        tag="result",
        width=-1,
        height=NEW_WINDOW_HEIGHT - 100,
        parent=data.name,
    ):
        dpg.add_plot_legend()

        dpg.add_plot_axis(
            dpg.mvXAxis,
            label="Players",
            tag="x_axis",
            no_gridlines=True,
        )
        dpg.add_plot_axis(
            dpg.mvYAxis,
            label="Ratings (Elo)",
            tag="y_axis",
            lock_min=True,
        )
        dpg.set_axis_ticks("x_axis", x_axis)
        dpg.fit_axis_data("y_axis")

        for i, player in enumerate(results):
            dpg.add_bar_series(
                [i * SPACING],
                [player["elo"]],
                weight=0.5,
                parent="y_axis",
            )
            dpg.add_plot_annotation(
                label=player["elo"],
                default_value=(i * SPACING, player["elo"] + 50),
            )

    dpg.add_button(
        label="save",
        parent=data.name,
        callback=file_dialog,
        user_data=(save_file, (data.name, results)),
    )


def rank_players(sender, app_data, user_data: tuple[Container, bool, bool]):
    data, player_a_won, draw = user_data
    num_of_players = len(data.players) - 1

    if player_a_won:
        winner = data.players[data.index_i]
        loser = data.players[data.index_j]
    else:
        winner = data.players[data.index_j]
        loser = data.players[data.index_i]

    data.elo.record_match(winner=winner, loser=loser, draw=draw)

    data.index_j += 1

    if data.index_j > num_of_players:
        data.index_i += 1
        data.index_j = data.index_i + 1
        dpg.set_item_label("player_a", label=data.players[data.index_i])

    if data.index_i != num_of_players:
        dpg.set_item_label("player_b", label=data.players[data.index_j])
        return

    dpg.delete_item("player_a")
    dpg.delete_item("player_b")
    dpg.delete_item("draw")

    display_results(data)


def create_ranker(data):
    WINDOW_WIDTH = 400
    WINDOW_HEIGHT = 150
    WINDOW_WIDTH_CENTER = WINDOW_WIDTH // 2
    WINDOW_HEIGHT_CENTER = WINDOW_HEIGHT // 2
    BUTTON_WIDTH = 120
    BUTTON_HEIGHT = 30
    BUTTON_OFFSET = 10

    with dpg.window(
        tag=data.name,
        no_close=True,
        width=WINDOW_WIDTH,
        height=WINDOW_HEIGHT,
        no_resize=True,
        pos=(100, 100),
    ):
        dpg.add_text(
            f"There are {math.comb(len(data.players), 2)} combinations of 2 "
            f"players for {len(data.players)}."
        )
        dpg.add_button(
            tag="player_a",
            width=BUTTON_WIDTH,
            height=BUTTON_HEIGHT,
            pos=(
                WINDOW_WIDTH_CENTER
                - BUTTON_WIDTH
                - BUTTON_OFFSET
                - (BUTTON_WIDTH // 2),
                WINDOW_HEIGHT_CENTER - (BUTTON_HEIGHT // 2),
            ),
            callback=rank_players,
            user_data=(data, True, False),
        )
        dpg.add_button(
            label="Both are equal",
            tag="draw",
            width=BUTTON_WIDTH,
            height=BUTTON_HEIGHT,
            pos=(
                WINDOW_WIDTH_CENTER - (BUTTON_WIDTH // 2),
                WINDOW_HEIGHT_CENTER - (BUTTON_HEIGHT // 2),
            ),
            callback=rank_players,
            user_data=(data, False, True),
        )
        dpg.add_button(
            tag="player_b",
            width=BUTTON_WIDTH,
            height=BUTTON_HEIGHT,
            pos=(
                WINDOW_WIDTH_CENTER
                + BUTTON_WIDTH
                + BUTTON_OFFSET
                - (BUTTON_WIDTH // 2),
                WINDOW_HEIGHT_CENTER - (BUTTON_HEIGHT // 2),
            ),
            callback=rank_players,
            user_data=(data, False, False),
        )

    dpg.set_item_label(item="player_a", label=data.players[data.index_i])
    dpg.set_item_label(item="player_b", label=data.players[data.index_j])


def new_dialog():
    with dpg.window(
        label="Open File",
        tag="new",
        no_close=True,
        no_resize=True,
        width=350,
        height=100,
        pos=(365, 310),
    ):
        dpg.add_text("Please load a JSON file with a list of players.")
        dpg.add_button(
            label="Open",
            width=50,
            user_data=(open_file, None),
            callback=file_dialog,
            pos=(290, 70),
        )


def main():
    VIEWPORT_WIDTH = 1080
    VIEWPORT_HEIGHT = 720

    dpg.create_context()
    dpg.create_viewport(
        title="Ranker Sorter", width=VIEWPORT_WIDTH, height=VIEWPORT_HEIGHT
    )

    new_dialog()

    dpg.setup_dearpygui()
    dpg.show_viewport()
    dpg.start_dearpygui()
    dpg.destroy_context()


if __name__ == "__main__":
    main()
