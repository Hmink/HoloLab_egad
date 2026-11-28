"""Adapter contract tests; legacy chemistry tests cover the reaction engine."""

from copy import deepcopy
import unittest
from server import STOCK, Mixture, mix_payload, session_request, transfer_request


def row(stock, oid):
    return dict(
        id=oid,
        stock=stock,
        mixture=mix_payload(Mixture.stock(STOCK[stock])),
        position=dict(x=0, y=0, z=0),
        sealed=False,
    )


class WebAdapterTests(unittest.TestCase):
    def test_roundtrip_preserves_quantities_and_old_schema_loads(self):
        rows = [row("hcl", 1), row("beaker", 2)]
        result = session_request(dict(schema="hololab3-session-1", objects=rows))
        self.assertEqual(result["objects"][0]["mixture"], rows[0]["mixture"])
        result = session_request(
            dict(
                schema="chemlab3d-session-1",
                objects=[dict(stock="beaker", x_norm=0.2, y_norm=0.7, roll=90)],
            )
        )
        self.assertAlmostEqual(result["objects"][0]["roll"], 1.57079632679)
        self.assertEqual(result["objects"][0]["normalized"], dict(x=0.2, y=0.7))

    def test_transfer_is_atomic_and_preserves_material(self):
        request = dict(source=row("hcl", 1), target=row("beaker", 2), allow_risk=True)
        before = deepcopy(request)
        response = transfer_request(request)
        self.assertTrue(response["ok"])
        self.assertEqual(request, before)
        self.assertAlmostEqual(
            response["source"]["volume_ml"] + response["target"]["volume_ml"], 100
        )
        self.assertAlmostEqual(
            response["source"]["mol"]["H_plus"] + response["target"]["mol"]["H_plus"],
            0.01,
        )

    def test_continuous_aliquot_and_invalid_amounts(self):
        request = dict(source=row("hcl", 1), target=row("beaker", 2), amount_ml=0.125)
        before = deepcopy(request)
        response = transfer_request(request)
        self.assertAlmostEqual(response["amount_ml"], 0.125)
        self.assertAlmostEqual(response["source"]["volume_ml"], 99.875)
        self.assertEqual(before, request)
        request["amount_ml"] = 1e-7
        self.assertAlmostEqual(transfer_request(request)["amount_ml"], 1e-7, places=12)
        for amount in (-1, 0, float("nan"), float("inf"), 1001, "2"):
            request["amount_ml"] = amount
            with self.assertRaises((ValueError, TypeError)):
                transfer_request(request)

    def test_closed_source_and_danger_lockout_preserve_inputs(self):
        request = dict(
            source=row("water", 1), target=row("acid_risk", 2), allow_risk=False
        )
        before = deepcopy(request)
        self.assertFalse(transfer_request(request)["ok"])
        self.assertEqual(request, before)
        request["source"]["sealed"] = True
        request["allow_risk"] = True
        self.assertFalse(transfer_request(request)["ok"])

    def test_qualitative_effect_has_no_invented_temperature(self):
        response = transfer_request(
            dict(source=row("water", 1), target=row("acid_risk", 2), allow_risk=True)
        )
        self.assertTrue(response["ok"])
        self.assertIsNotNone(response["effect"])
        self.assertIsNone(response["target"]["temperature_K"])
        self.assertTrue(response["target"]["qualitative"])

    def test_invalid_session_is_rejected_before_client_commit(self):
        for mutate in [
            lambda x: x.update(position=dict(x=float("nan"), y=0, z=0)),
            lambda x: x["mixture"].update(volume_ml=-1),
            lambda x: x["mixture"].update(mol={"invented": 1}),
            lambda x: x.update(position=dict(x=0, y=0, z=5)),
        ]:
            item = row("hcl", 1)
            mutate(item)
            with self.assertRaises((ValueError, KeyError)):
                session_request(dict(schema="hololab3-session-1", objects=[item]))
        with self.assertRaises(ValueError):
            session_request(
                dict(
                    schema="hololab3-session-1",
                    objects=[row("beaker", 1), row("flask", 1)],
                )
            )


if __name__ == "__main__":
    unittest.main()
