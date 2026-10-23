<?php

function validarCPF($cpf) {
    if (!preg_match('/^[0-9]{11}$/', $cpf) ||
        preg_match('/^([0-9])\1{10}$/', $cpf)) {
        return false;
    }

    for ($t = 9; $t < 11; $t++) {
        $soma = 0;

        for ($i = 0; $i < $t; $i++) {
            $soma += (int) $cpf[$i] * (($t + 1) - $i);
        }

        $digito = ($soma * 10) % 11;

        if ($digito == 10) {
            $digito = 0;
        }

        if ($digito != (int) $cpf[$t]) {
            return false;
        }
    }

    return true;
}

function validarCNPJ($cnpj) {
    if (!preg_match('/^[A-Z0-9]{12}[0-9]{2}$/', $cnpj) ||
        preg_match('/^(.)\1{13}$/', $cnpj)) {
        return false;
    }

    for ($t = 12; $t < 14; $t++) {
        $pesos = $t == 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        $soma = 0;

        for ($i = 0; $i < $t; $i++) {
            $valor = ord($cnpj[$i]) - 48;
            $soma += $valor * $pesos[$i];
        }

        $resto = $soma % 11;
        $digito = $resto < 2 ? 0 : 11 - $resto;

        if ($digito != (int) $cnpj[$t]) {
            return false;
        }
    }

    return true;
}