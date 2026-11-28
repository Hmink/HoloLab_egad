import { react } from "./reaction-engine.js";
export async function setupReactionLibrary() {
  const conditionNames = {
    aqueous_dilute_full_neutralization:
      "Dung dịch loãng, trung hòa hoàn toàn theo phương trình",
    aqueous_no_excess_complexing_reagent:
      "Dung dịch nước, không có dư tác nhân tạo phức hoặc hòa tan kết tủa",
    aqueous_clean_metal_no_excess_oxidant:
      "Bề mặt kim loại sạch, dung dịch nước; không dư chất oxi hóa mạnh",
    aqueous_suitable_contact:
      "Tiếp xúc phù hợp trong môi trường nước; chưa tính tốc độ",
    heating_required:
      "Cấp nhiệt phù hợp (chỉ xác nhận giả định, chưa mô phỏng lò nung)",
    aqueous_open_vessel: "Dung dịch nước, bình mở",
    aqueous_specified_reagent_ratio:
      "Đúng tỉ lệ CO₂/bazơ tương ứng phương trình",
  };
  const $ = (id) => document.getElementById(id),
    dlg = $("reactions-dialog");
  $("reaction-library").onclick = () => dlg.showModal();
  $("reactions-close").onclick = () => dlg.close();
  try {
    const data = await (await fetch("/data/reactions100.json")).json();
    for (const r of data.reactions) {
      const o = document.createElement("option");
      o.value = r.id;
      o.textContent = `${r.id} · ${r.category} · ${r.equation}`;
      $("reaction-select").append(o);
    }
    let current;
    function select() {
      current = data.reactions.find((r) => r.id === $("reaction-select").value);
      $("reaction-equation").textContent = current.equation;
      $("reaction-inputs").replaceChildren();
      $("reaction-condition").checked = false;
      $("reaction-result").textContent = "";
      $("reaction-condition-label").textContent =
        "Điều kiện: " +
        (conditionNames[current.condition] || current.condition);
      for (const f of Object.keys(current.reactants)) {
        const label = document.createElement("label");
        label.textContent = f + " (mol)";
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 1000;
        input.step = 0.001;
        input.value = 0.01;
        input.dataset.formula = f;
        label.append(input);
        $("reaction-inputs").append(label);
      }
    }
    $("reaction-select").onchange = select;
    select();
    $("reaction-calculate").onclick = () => {
      try {
        const amounts = Object.fromEntries(
          [...$("reaction-inputs").querySelectorAll("input")].map((n) => [
            n.dataset.formula,
            Number(n.value),
          ]),
        );
        const result = react(current, amounts, $("reaction-condition").checked);
        $("reaction-result").textContent =
          result.message +
          (result.products_mol
            ? "\n\nChất giới hạn: " +
              result.limiting.join(", ") +
              "\nSản phẩm lý thuyết:\n" +
              Object.entries(result.products_mol)
                .map(([f, n]) => f + ": " + n.toPrecision(4) + " mol")
                .join("\n") +
              "\n\nLượng dư:\n" +
              Object.entries(result.remaining_mol)
                .map(([f, n]) => f + ": " + n.toPrecision(4) + " mol")
                .join("\n") +
              "\n\n" +
              result.phenomenon +
              "\n" +
              Object.entries(result.precipitate_colors)
                .map(([f, c]) => f + ": " + c)
                .join("; ") +
              "\n\nGiới hạn: " +
              result.limitation
            : "");
      } catch (e) {
        $("reaction-result").textContent = e.message;
      }
    };
  } catch (e) {
    $("reaction-result").textContent =
      "Không tải được cơ sở dữ liệu: " + e.message;
  }
}
