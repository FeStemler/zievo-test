<?php
// Incluir o arquivo de funções
include("functions.php");

// Verificar o tipo de requisição
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Decodificar os dados do corpo da requisição como JSON
    $requestData = json_decode(file_get_contents("php://input"), true);
    
    // Verificar se os parâmetros necessários estão presentes
    if (isset($requestData['items'])) {
        // Chamar a função para realizar a venda
        $vendaRealizada = cadastrarVenda($requestData['items']);
        
        // Verificar se a venda foi realizada com sucesso
        if ($vendaRealizada) {
            // Retornar uma resposta de sucesso
            $response = array("success" => true, "message" => "Venda realizada com sucesso");
            echo json_encode($response);
        } else {
            // Retornar uma mensagem de erro se a venda falhar
            $response = array("success" => false, "message" => "Erro ao realizar a venda");
            echo json_encode($response);
        }
    } else {
        // Retornar uma mensagem de erro se os parâmetros estiverem ausentes
        $response = array("success" => false, "message" => "Parâmetros insuficientes para realizar a venda");
        echo json_encode($response);
    }
} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Verificar se é uma requisição GET para obter todas as vendas
    $vendas = obterVendasComItens();
    
    // Retornar as vendas em formato JSON
    echo json_encode($vendas);
} else {
    // Retornar uma mensagem de erro se o método da requisição não for suportado
    $response = array("success" => false, "message" => "Método de requisição não suportado");
    echo json_encode($response);
}
?>
